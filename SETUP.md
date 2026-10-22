# StateShift Breathwork - Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **npm** or **yarn**
- **Expo Go** app on your iOS/Android device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

```bash
# Clone the repository (if not already cloned)
git clone https://github.com/johngiovanni/git_test2
cd git_test2

# Checkout the development branch
git checkout claude/stateshift-breathwork-mvp-AJIBy

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Your Device

1. **Start the server**: `npm start`
2. **Open Expo Go** on your phone
3. **Scan the QR code** that appears in your terminal:
   - iOS: Use your Camera app
   - Android: Use the Expo Go app's QR scanner

### Alternative: Run on Simulator/Emulator

```bash
# iOS (requires macOS + Xcode)
npm run ios

# Android (requires Android Studio)
npm run android

# Web browser (limited functionality)
npm run web
```

## 📱 App Overview

### Main Screens

1. **Onboarding** (first launch only)
   - 4-step introduction
   - Overview of features and safety

2. **Home Screen**
   - Browse 6 breathing techniques
   - View your stats (sessions, minutes, streak)
   - Organized by state type (Calm, Energy, Focus)

3. **Session Screen**
   - Pre-session state rating (1-10)
   - Animated breathing guide with expanding circles
   - Haptic feedback on breath transitions
   - Post-session rating and improvement tracking

### Available Techniques

#### 🌊 Calm (Cool Colors)
- **Extended Exhale** - 4s in, 8s out - Vagal activation
- **Box Breathing** - 4-4-4-4 - Coherence
- **Resonant Frequency** - 5.5s in/out - Max HRV

#### 🔥 Energy (Warm Colors)
- **Kapalabhati** - Rapid exhales - Energizing ⚠️
- **Wim Hof Method** - 30-40 breaths + retention - Energy & resilience ⚠️

#### 🧘 Focus (Purple Colors)
- **Alternate Nostril** - 4-4-4 alternating - Balance & focus

⚠️ = Includes safety disclaimer

## 🏗️ Project Structure

```
src/
├── components/
│   └── BreathingCircle.tsx      # Animated visual guide (Reanimated)
├── screens/
│   ├── HomeScreen.tsx            # Technique library + stats
│   ├── SessionScreen.tsx         # Complete session flow
│   └── OnboardingScreen.tsx      # First-launch experience
├── data/
│   └── techniques.ts             # 6 technique definitions
├── types/
│   └── index.ts                  # TypeScript interfaces
├── hooks/
│   └── useFirstLaunch.ts         # Onboarding state
└── utils/
    └── storage.ts                # AsyncStorage helpers
```

## 🔧 Tech Stack

- **React Native** 0.74.5 with **Expo** 51
- **TypeScript** for type safety
- **React Navigation** for screen transitions
- **Reanimated** for smooth 60fps animations
- **AsyncStorage** for offline-first data persistence
- **Expo Haptics** for tactile feedback
- **Expo AV** for future audio guidance

## 📊 Data Storage

All data is stored **locally on your device** using AsyncStorage:
- Session history (date, duration, ratings)
- User profile (onboarding status)
- No cloud sync in MVP (coming in Phase 2)

### Storage Keys
- `@stateshift_first_launch` - Onboarding completion
- `@stateshift_sessions` - Array of session data
- `@stateshift_profile` - User preferences

## 🧪 Testing Your Changes

### Manual Testing Checklist

- [ ] Onboarding shows on first launch
- [ ] Can select and start each technique
- [ ] Breathing circle animates smoothly
- [ ] Haptic feedback works on phase transitions
- [ ] Pre/post ratings save correctly
- [ ] Stats update after completing session
- [ ] Back navigation works throughout
- [ ] Safety disclaimers show for Kapalabhati & Wim Hof
- [ ] App works offline

### Performance Tips

- Animations run at 60fps on most devices
- Test on actual device (not just simulator)
- Check haptics work (simulator won't show haptics)

## 🐛 Troubleshooting

### "Metro bundler won't start"
```bash
# Clear cache and restart
npm start -- --clear
```

### "QR code won't scan"
- Make sure phone and computer are on same WiFi
- Try typing the URL manually in Expo Go
- Use tunnel mode: `npm start -- --tunnel`

### "Dependencies won't install"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "TypeScript errors"
```bash
# Restart TypeScript server in VS Code
# Cmd+Shift+P > "TypeScript: Restart TS Server"
```

## 🚢 Next Steps

### Phase 2 Roadmap
- [ ] Audio voice guidance
- [ ] HRV biometric integration
- [ ] AI technique recommendations
- [ ] Premium features & analytics
- [ ] Apple Health / Google Fit sync
- [ ] Custom technique builder
- [ ] Cloud sync & backup

### Phase 3 Roadmap
- [ ] Community features
- [ ] Instructor marketplace
- [ ] Advanced analytics dashboard
- [ ] Team/group sessions

## 📝 Notes

- MVP built for rapid iteration
- Offline-first architecture
- Safety-focused design
- Science-backed techniques only
- Privacy-first (no external tracking)

## 🤝 Contributing

This is an MVP - contributions and feedback welcome!

## 📄 License

Proprietary - All rights reserved
