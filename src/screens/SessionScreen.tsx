import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { BreathingCircle } from '../components/BreathingCircle';
import { getTechniqueById } from '../data/techniques';
import { saveSession } from '../utils/storage';
import { SessionData, BreathCycle } from '../types';

const { height } = Dimensions.get('window');

interface SessionScreenProps {
  navigation: any;
  route: {
    params: {
      techniqueId: string;
    };
  };
}

type SessionPhase = 'pre' | 'active' | 'post';

const SessionScreen: React.FC<SessionScreenProps> = ({ navigation, route }) => {
  const { techniqueId } = route.params;
  const technique = getTechniqueById(techniqueId);

  const [phase, setPhase] = useState<SessionPhase>('pre');
  const [preRating, setPreRating] = useState<number>(5);
  const [postRating, setPostRating] = useState<number>(5);
  const [intention, setIntention] = useState<string>('');

  const [currentCycle, setCurrentCycle] = useState<BreathCycle>({
    phase: 'inhale',
    duration: technique?.inhaleSeconds || 4,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(!!technique?.warning);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const startSession = () => {
    if (!technique) return;
    setPhase('active');
    setIsPlaying(true);
    startTimeRef.current = Date.now();
    startBreathingCycle();
  };

  const startBreathingCycle = () => {
    if (!technique) return;

    const cycles: BreathCycle[] = [
      { phase: 'inhale', duration: technique.inhaleSeconds },
    ];

    if (technique.holdSeconds) {
      cycles.push({ phase: 'hold', duration: technique.holdSeconds });
    }

    cycles.push({ phase: 'exhale', duration: technique.exhaleSeconds });

    if (technique.postHoldSeconds) {
      cycles.push({ phase: 'postHold', duration: technique.postHoldSeconds });
    }

    let cycleIndex = 0;
    setCurrentCycle(cycles[0]);

    const runCycle = () => {
      const cycle = cycles[cycleIndex];
      setCurrentCycle(cycle);

      // Haptic feedback at phase transitions
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      cycleIndex = (cycleIndex + 1) % cycles.length;

      timerRef.current = setTimeout(runCycle, cycle.duration * 1000);
    };

    timerRef.current = setTimeout(
      runCycle,
      cycles[0].duration * 1000
    );

    // Update elapsed time every second
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(timeInterval);
  };

  const pauseSession = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const resumeSession = () => {
    setIsPlaying(true);
    startBreathingCycle();
  };

  const endSession = async () => {
    pauseSession();
    setPhase('post');
  };

  const completeSession = async () => {
    if (!technique) return;

    const sessionData: SessionData = {
      id: `session_${Date.now()}`,
      techniqueId: technique.id,
      startTime: startTimeRef.current,
      endTime: Date.now(),
      durationMinutes: Math.floor(elapsedTime / 60),
      preSessionRating: preRating,
      postSessionRating: postRating,
      intention,
      completed: true,
    };

    try {
      await saveSession(sessionData);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const getPhaseText = () => {
    switch (currentCycle.phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'postHold':
        return 'Hold Empty';
      default:
        return '';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!technique) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Technique not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {phase === 'pre' && (
        <View style={styles.preSession}>
          <Text style={styles.techniqueName}>{technique.name}</Text>
          <Text style={styles.description}>{technique.description}</Text>

          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            {technique.instructions.map((instruction, index) => (
              <Text key={index} style={styles.instructionItem}>
                {index + 1}. {instruction}
              </Text>
            ))}
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>
              How do you feel right now? (1-10)
            </Text>
            <View style={styles.ratingButtons}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.ratingButton,
                    preRating === num && styles.ratingButtonActive,
                  ]}
                  onPress={() => setPreRating(num)}
                >
                  <Text
                    style={[
                      styles.ratingButtonText,
                      preRating === num && styles.ratingButtonTextActive,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.startButton,
              { backgroundColor: technique.colorScheme.primary },
            ]}
            onPress={() => {
              if (technique.warning) {
                setShowDisclaimer(true);
              } else {
                startSession();
              }
            }}
          >
            <Text style={styles.startButtonText}>Start Session</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === 'active' && (
        <View style={styles.activeSession}>
          <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>

          <View style={styles.circleContainer}>
            <BreathingCircle
              phase={currentCycle.phase}
              duration={currentCycle.duration}
              colors={technique.colorScheme.gradient}
            />
          </View>

          <Text style={styles.phaseText}>{getPhaseText()}</Text>

          <View style={styles.controls}>
            {isPlaying ? (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={pauseSession}
              >
                <Text style={styles.controlButtonText}>Pause</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={resumeSession}
              >
                <Text style={styles.controlButtonText}>Resume</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.controlButton, styles.endButton]}
              onPress={endSession}
            >
              <Text style={styles.controlButtonText}>End Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {phase === 'post' && (
        <View style={styles.postSession}>
          <Text style={styles.completionTitle}>Session Complete!</Text>
          <Text style={styles.completionTime}>
            Duration: {formatTime(elapsedTime)}
          </Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>How do you feel now? (1-10)</Text>
            <View style={styles.ratingButtons}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.ratingButton,
                    postRating === num && styles.ratingButtonActive,
                  ]}
                  onPress={() => setPostRating(num)}
                >
                  <Text
                    style={[
                      styles.ratingButtonText,
                      postRating === num && styles.ratingButtonTextActive,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {postRating > preRating && (
            <Text style={styles.improvement}>
              ✨ You improved by {postRating - preRating} points!
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.doneButton,
              { backgroundColor: technique.colorScheme.primary },
            ]}
            onPress={completeSession}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showDisclaimer}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDisclaimer(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.disclaimerModal}>
            <Text style={styles.disclaimerTitle}>⚠️ Important Safety Notice</Text>
            <Text style={styles.disclaimerText}>{technique.warning}</Text>
            <Text style={styles.disclaimerText}>
              This technique should only be practiced by healthy individuals.
              Consult your healthcare provider if you have any medical conditions.
            </Text>
            <View style={styles.disclaimerButtons}>
              <TouchableOpacity
                style={styles.disclaimerCancel}
                onPress={() => {
                  setShowDisclaimer(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.disclaimerCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.disclaimerAccept,
                  { backgroundColor: technique.colorScheme.primary },
                ]}
                onPress={() => {
                  setShowDisclaimer(false);
                  startSession();
                }}
              >
                <Text style={styles.disclaimerAcceptText}>
                  I Understand
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 50,
  },
  preSession: {
    flex: 1,
    padding: 20,
  },
  techniqueName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 30,
    lineHeight: 24,
  },
  instructions: {
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  instructionItem: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    marginBottom: 30,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  ratingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  ratingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  ratingButtonActive: {
    backgroundColor: '#4A90E2',
  },
  ratingButtonText: {
    color: '#888888',
    fontSize: 16,
    fontWeight: '600',
  },
  ratingButtonTextActive: {
    color: '#FFFFFF',
  },
  startButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#222222',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  activeSession: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 40,
  },
  timer: {
    fontSize: 24,
    color: '#888888',
    fontFamily: 'monospace',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  controls: {
    flexDirection: 'row',
    gap: 15,
  },
  controlButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#222222',
  },
  endButton: {
    backgroundColor: '#333333',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  postSession: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  completionTime: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 40,
  },
  improvement: {
    fontSize: 18,
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  doneButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  disclaimerModal: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  disclaimerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: 16,
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 15,
    color: '#CCCCCC',
    marginBottom: 12,
    lineHeight: 22,
  },
  disclaimerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  disclaimerCancel: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#222222',
    alignItems: 'center',
  },
  disclaimerCancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimerAccept: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disclaimerAcceptText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SessionScreen;
