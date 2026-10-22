import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';

interface BreathingCircleProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'postHold';
  duration: number;
  colors: string[];
}

const { width } = Dimensions.get('window');
const MAX_SIZE = width * 0.7;
const MIN_SIZE = width * 0.3;

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  phase,
  duration,
  colors,
}) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    const targetScale = phase === 'inhale' || phase === 'hold' ? 1 : 0.5;
    const targetOpacity = phase === 'hold' || phase === 'postHold' ? 1 : 0.8;

    scale.value = withTiming(targetScale, {
      duration: duration * 1000,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });

    opacity.value = withTiming(targetOpacity, {
      duration: duration * 1000,
      easing: Easing.inOut(Easing.ease),
    });
  }, [phase, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getGradientColor = () => {
    if (colors.length === 1) return colors[0];
    const midIndex = Math.floor(colors.length / 2);
    return colors[midIndex];
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          animatedStyle,
          { backgroundColor: getGradientColor() },
        ]}
      />
      <Animated.View
        style={[
          styles.circleOuter,
          animatedStyle,
          {
            backgroundColor: colors[0],
            opacity: opacity.value * 0.3,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: MAX_SIZE,
    height: MAX_SIZE,
  },
  circle: {
    width: MAX_SIZE,
    height: MAX_SIZE,
    borderRadius: MAX_SIZE / 2,
    position: 'absolute',
  },
  circleOuter: {
    width: MAX_SIZE * 1.2,
    height: MAX_SIZE * 1.2,
    borderRadius: (MAX_SIZE * 1.2) / 2,
    position: 'absolute',
  },
});
