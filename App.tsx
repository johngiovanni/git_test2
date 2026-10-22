import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import SessionScreen from './src/screens/SessionScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { useFirstLaunch } from './src/hooks/useFirstLaunch';

const Stack = createStackNavigator();

export default function App() {
  const { isFirstLaunch, isLoading } = useFirstLaunch();

  if (isLoading) {
    return null; // Could add a splash screen component here
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#000000' },
          }}
          initialRouteName={isFirstLaunch ? 'Onboarding' : 'Home'}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Session" component={SessionScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
