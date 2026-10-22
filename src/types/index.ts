export type StateType = 'calm' | 'energy' | 'focus' | 'therapeutic';

export interface BreathingTechnique {
  id: string;
  name: string;
  category: StateType;
  pattern: string;
  description: string;
  effect: string;
  durationMin: number;
  durationMax: number;
  inhaleSeconds: number;
  holdSeconds?: number;
  exhaleSeconds: number;
  postHoldSeconds?: number;
  warning?: string;
  instructions: string[];
  colorScheme: {
    primary: string;
    secondary: string;
    gradient: string[];
  };
}

export interface SessionData {
  id: string;
  techniqueId: string;
  startTime: number;
  endTime?: number;
  durationMinutes: number;
  preSessionRating: number;
  postSessionRating?: number;
  intention?: string;
  notes?: string;
  completed: boolean;
}

export interface UserProfile {
  onboardingCompleted: boolean;
  primaryGoal?: 'calm' | 'energy' | 'focus' | 'sleep' | 'performance';
  experience?: 'beginner' | 'intermediate' | 'advanced';
  healthConditions?: string[];
  baselineHRV?: number;
}

export interface BreathCycle {
  phase: 'inhale' | 'hold' | 'exhale' | 'postHold';
  duration: number;
}
