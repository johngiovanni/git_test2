import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TECHNIQUES } from '../data/techniques';
import { StateType } from '../types';
import { getSessionStats } from '../utils/storage';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    avgImprovement: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const sessionStats = await getSessionStats();
    setStats(sessionStats);
  };

  const categories: { type: StateType; label: string; color: string }[] = [
    { type: 'calm', label: 'Calm', color: '#4A90E2' },
    { type: 'energy', label: 'Energy', color: '#E74C3C' },
    { type: 'focus', label: 'Focus', color: '#9B59B6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>StateShift</Text>
          <Text style={styles.subtitle}>Science-backed breathwork</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {categories.map((category) => (
          <View key={category.type} style={styles.categorySection}>
            <Text style={[styles.categoryTitle, { color: category.color }]}>
              {category.label}
            </Text>
            {TECHNIQUES.filter((t) => t.category === category.type).map(
              (technique) => (
                <TouchableOpacity
                  key={technique.id}
                  style={[
                    styles.techniqueCard,
                    { borderLeftColor: technique.colorScheme.primary },
                  ]}
                  onPress={() =>
                    navigation.navigate('Session', { techniqueId: technique.id })
                  }
                >
                  <View style={styles.techniqueHeader}>
                    <Text style={styles.techniqueName}>{technique.name}</Text>
                    <Text style={styles.techniquePattern}>
                      {technique.pattern}
                    </Text>
                  </View>
                  <Text style={styles.techniqueDescription}>
                    {technique.description}
                  </Text>
                  <Text style={styles.techniqueEffect}>{technique.effect}</Text>
                  {technique.warning && (
                    <Text style={styles.warning}>⚠️ {technique.warning}</Text>
                  )}
                </TouchableOpacity>
              )
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  techniqueCard: {
    backgroundColor: '#111111',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  techniqueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  techniqueName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  techniquePattern: {
    fontSize: 12,
    color: '#888888',
    fontFamily: 'monospace',
  },
  techniqueDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
    lineHeight: 20,
  },
  techniqueEffect: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  warning: {
    fontSize: 11,
    color: '#E74C3C',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default HomeScreen;
