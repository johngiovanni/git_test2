import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirstLaunch } from '../hooks/useFirstLaunch';

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const { completeOnboarding } = useFirstLaunch();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to StateShift',
      description:
        'Transform your state with science-backed breathing techniques. Shift from stress to calm, fatigue to energy, or distraction to focus.',
      emoji: '🌊',
    },
    {
      title: 'How It Works',
      description:
        'Each technique is designed to activate specific physiological responses. Follow the visual guide, breathe, and feel the shift.',
      emoji: '✨',
    },
    {
      title: 'Safety First',
      description:
        'Some techniques are powerful. We'll show warnings when needed. Never practice intense breathing while driving or in water.',
      emoji: '⚠️',
    },
    {
      title: 'Track Your Progress',
      description:
        'Rate how you feel before and after each session. Watch your stats grow and build a daily practice.',
      emoji: '📈',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await completeOnboarding();
    navigation.replace('Home');
  };

  const step = steps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.emoji}>{step.emoji}</Text>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? "Let's Begin" : 'Next'}
            </Text>
          </TouchableOpacity>

          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleComplete}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
  },
  progressDotActive: {
    backgroundColor: '#4A90E2',
    width: 24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  nextButton: {
    backgroundColor: '#4A90E2',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#222222',
  },
  skipButtonText: {
    color: '#888888',
    fontSize: 16,
  },
});

export default OnboardingScreen;
