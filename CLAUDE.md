# Reinnovation Scan

Real estate rehab scanning app for fix-and-flip operators. Uses iOS ARKit/RoomPlan for structured room scanning, React Native for UI, and Supabase for backend.

## Project Overview

**Goal**: MVP for iOS to scan properties, capture room geometry, and enable remote inspection and cost estimation.

**Tech Stack**:
- React Native + Expo Dev Client
- TypeScript
- Supabase (auth, database, storage)
- iOS ARKit/RoomPlan (Phase 3)
- React Navigation

## Current Status

**Phase 1: Complete** ✓
- React Native foundation with Expo Dev Client
- TypeScript setup
- Navigation (auth stack, main tabs)
- Supabase auth integration
- Property CRUD
- Room CRUD (basic)
- Settings screen

## Project Structure

```
src/
  App.tsx                    # Root component
  types/                     # TypeScript types
    index.ts
  services/
    supabase.ts             # Supabase API calls
  store/
    authStore.ts            # Zustand auth state
    propertyStore.ts        # Zustand properties/rooms state
  components/
    Button.tsx
    TextInput.tsx
    ErrorMessage.tsx
    Screen.tsx
  screens/
    auth/
      LoginScreen.tsx
      SignUpScreen.tsx
    main/
      HomeScreen.tsx
      PropertyDetailScreen.tsx
      CreatePropertyScreen.tsx
      RoomDetailScreen.tsx
      SettingsScreen.tsx
  navigation/
    RootNavigator.tsx
    AuthNavigator.tsx
    MainNavigator.tsx
```

## Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS dev environment (Xcode)
- Supabase project

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Schema

**TODO**: Create Supabase tables:
- users (auto-created by auth)
- properties
- rooms
- walls
- doors
- windows
- room_photos
- repair_items

### Run

```bash
npm start              # Start dev server
npm run ios          # Run on iOS
npm run android      # Run on Android (later)
npm run web          # Run web preview
npm run type-check   # Type checking
```

## Next Steps

**Phase 2**: Rooms & Scan Workflow UI
- Enhanced room form
- Scan workflow screens (pre-scan, guide, post-scan)
- Inspection checklist UI

**Phase 3**: iOS ARKit/RoomPlan Module
- Swift native module
- RoomPlan scanner integration
- React Native bridge

**Phase 4**: Data Persistence
- Parse RoomPlan output
- Store room geometry in Supabase

**Phase 5**: Anchored Photos
- Capture inspection photos
- Store with metadata

**Phase 6**: Room Viewer
- Display room details
- View walls, doors, windows
- Add notes and costs

**Phase 7**: Scope Generator
- Compile repair items
- Generate scope document

## Code Standards

- TypeScript strict mode enabled
- Functional components + hooks
- Zustand for state management
- Modular, reusable components
- No fake APIs (mark TODO)
- Clean folder structure
- Error handling and loading states

## Key Design Decisions

1. **Expo Dev Client**: Allows native code (ARKit) while keeping React Native workflow
2. **Zustand**: Lightweight state management without Redux complexity
3. **iOS-first**: ARKit/RoomPlan is iOS-only; Android support deferred
4. **Modular services**: Supabase calls isolated in `services/`
5. **Simple UI**: Focus on construction intelligence, not visual polish
