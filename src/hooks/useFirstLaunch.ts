import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_LAUNCH_KEY = '@stateshift_first_launch';

export const useFirstLaunch = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      setIsFirstLaunch(hasLaunched === null);
    } catch (error) {
      console.error('Error checking first launch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'true');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return { isFirstLaunch, isLoading, completeOnboarding };
};
