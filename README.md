# StateShift Breathwork MVP

Transform your physiological and psychological state through science-backed breathing techniques.

## Features

- **6 Core Breathing Techniques**
  - Extended Exhale (vagal activation)
  - Box Breathing (coherence)
  - Resonant Frequency (HRV optimization)
  - Kapalabhati (energizing)
  - Wim Hof Method (energy & resilience)
  - Alternate Nostril (balance & focus)

- **Minimalist Session UI**
  - Expanding circle visual guide
  - Color-coded states (cool = calm, warm = energy)
  - Haptic feedback for phase transitions
  - Real-time breath guidance

- **Progress Tracking**
  - Pre/post session state ratings
  - Session minutes and streaks
  - Offline-first architecture
  - Session history

- **Safety First**
  - Medical disclaimers for intense techniques
  - Contraindication warnings
  - Clear safety instructions

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Reanimated** for smooth animations
- **AsyncStorage** for offline-first data persistence
- **Expo Haptics** for tactile feedback
- **Expo AV** for audio guidance (ready for future enhancement)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (iOS/Android)

### Installation

```bash
npm install
```

### Running the App

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### Testing on Device

1. Install Expo Go on your phone
2. Run `npm start`
3. Scan the QR code with your camera (iOS) or Expo Go app (Android)

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── BreathingCircle.tsx
├── screens/          # Main app screens
│   ├── HomeScreen.tsx
│   ├── SessionScreen.tsx
│   └── OnboardingScreen.tsx
├── data/             # Technique definitions
│   └── techniques.ts
├── hooks/            # Custom React hooks
│   └── useFirstLaunch.ts
├── types/            # TypeScript type definitions
│   └── index.ts
└── utils/            # Utilities
    └── storage.ts
```

## MVP Scope

This is the initial MVP (3-4 month build) focusing on:
- ✅ 6 core breathing techniques
- ✅ Basic animated UI
- ✅ Haptic guidance
- ✅ Offline-first storage
- ✅ Pre/post session ratings
- ✅ Basic progress tracking
- ✅ Safety disclaimers

## Future Enhancements (Post-MVP)

- **Phase 2**: Premium features, AI coach, advanced analytics, wearable integration
- **Phase 3**: Community features, instructor marketplace
- Audio voice guidance
- Biometric integration (HRV, heart rate)
- Advanced AI recommendations
- Custom technique builder
- Apple Health / Google Fit integration

## Design Philosophy

- **Safety over engagement** - Clear warnings and medical disclaimers
- **Empower independence** - Build sustainable practice, not dependency
- **Science-backed only** - Every technique based on research
- **Privacy-first** - All data stored locally, offline-first

## License

Proprietary - All rights reserved
