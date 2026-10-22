import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionData, UserProfile } from '../types';

const SESSIONS_KEY = '@stateshift_sessions';
const PROFILE_KEY = '@stateshift_profile';

export const saveSession = async (session: SessionData): Promise<void> => {
  try {
    const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
    const sessions: SessionData[] = sessionsJson ? JSON.parse(sessionsJson) : [];
    sessions.push(session);
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

export const getSessions = async (): Promise<SessionData[]> => {
  try {
    const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
    return sessionsJson ? JSON.parse(sessionsJson) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};

export const getSessionStats = async () => {
  try {
    const sessions = await getSessions();
    const completedSessions = sessions.filter(s => s.completed);

    const totalMinutes = completedSessions.reduce(
      (sum, s) => sum + s.durationMinutes,
      0
    );

    const avgImprovement = completedSessions.reduce((sum, s) => {
      if (s.postSessionRating && s.preSessionRating) {
        return sum + (s.postSessionRating - s.preSessionRating);
      }
      return sum;
    }, 0) / completedSessions.length || 0;

    // Calculate streak
    const today = new Date().setHours(0, 0, 0, 0);
    const sortedSessions = [...completedSessions].sort(
      (a, b) => b.startTime - a.startTime
    );

    let streak = 0;
    let checkDate = today;

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.startTime).setHours(0, 0, 0, 0);
      if (sessionDate === checkDate) {
        streak++;
        checkDate -= 86400000; // Subtract one day
      } else if (sessionDate < checkDate) {
        break;
      }
    }

    return {
      totalSessions: completedSessions.length,
      totalMinutes,
      currentStreak: streak,
      avgImprovement: Math.round(avgImprovement * 10) / 10,
    };
  } catch (error) {
    console.error('Error calculating stats:', error);
    return {
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      avgImprovement: 0,
    };
  }
};

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

export const getProfile = async (): Promise<UserProfile | null> => {
  try {
    const profileJson = await AsyncStorage.getItem(PROFILE_KEY);
    return profileJson ? JSON.parse(profileJson) : null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};
