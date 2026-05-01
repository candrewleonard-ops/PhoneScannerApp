# expo-room-plan-scanner

Local Expo Module that exposes Apple's `RoomPlan` framework to React Native.

## Requirements

- iOS device with a **LiDAR scanner** (iPhone 12 Pro or newer Pro / Pro Max, iPad Pro 11"/12.9" with LiDAR)
- iOS **16.0** or newer (RoomPlan was introduced in iOS 16)
- Xcode 15+ (for the iOS 17 SDK)
- Expo SDK **51** with **Expo Dev Client** (this module ships native code, so Expo Go cannot run it)

The module compiles with availability checks (`#available(iOS 16.0, *)`), so the host app deployment target is bumped to **iOS 16.0** in `app.json` via `expo-build-properties`.

## What it does

Presents Apple's stock `RoomCaptureView` modally on top of the React Native root view. When the user taps **Done** the captured `CapturedRoom` is:

1. Encoded to JSON and saved to `Documents/RoomScans/<roomId>/scan-<ts>.json`
2. Exported to USDZ at `Documents/RoomScans/<roomId>/scan-<ts>.usdz` (best effort)
3. Returned to JS as a `RoomScanResult`

## JS API

```ts
import RoomPlanScanner, {
  isRoomPlanSupported,
  startRoomScan,
  RoomScanResult,
  RoomPlanError,
} from '@/native/RoomPlanScanner';

const supported = await isRoomPlanSupported();
const result = await startRoomScan(roomId);
```

`RoomPlanError` carries a `.code` matching one of:
`E_UNSUPPORTED_OS | E_UNSUPPORTED_DEVICE | E_FRAMEWORK_MISSING | E_NO_PRESENTER | E_SCAN_CANCELLED | E_SCAN_FAILED`.

## Project setup

After adding this module (already wired into the repo), run from the project root:

```bash
npm install
npx expo prebuild --clean         # regenerates ios/ with the local module + plugins
npx pod-install ios               # or `cd ios && pod install`
npx expo run:ios --device         # build & install on a real LiDAR device
```

> Simulator builds will compile but `isRoomPlanSupported()` returns `false`, so the **Start Scan** button is disabled.

## Known limitations & TODOs

- **Floor area** is currently a rough axis-aligned bounding-box estimate from wall positions. The Phase 4 parsing layer should compute polygon area from `rawJson` (or use `CapturedRoom.floors` on iOS 17+).
- **No multi-room** support yet. iOS 17 introduced `RoomBuilder` for stitching multiple `CapturedRoom`s; that's out of scope for the MVP.
- **Coaching overlay text** is the iOS default. We can localize / customize it later if needed.
- **No per-frame camera frame export.** RoomPlan does not expose intermediate AR frames for anchored photos — Phase 5 will use a separate ARKit session for that.
- **Persistence to Supabase** happens in JS land via `scansService.saveRoomScanStructure` (see `src/services/scans.ts`). The native module only returns the data; it does not upload.

## File layout

```
modules/expo-room-plan-scanner/
  expo-module.config.json
  package.json
  README.md
  ios/
    ExpoRoomPlanScanner.podspec
    ExpoRoomPlanScannerModule.swift   # Expo Module definition (JS-facing API)
    RoomScannerViewController.swift   # Hosts RoomCaptureView, builds result
  src/
    index.ts                          # requireNativeModule + re-exports
    types.ts                          # RoomScanResult / RoomScanSummary / error codes
```

## Why a local Expo Module (not a classic RN bridge)

- First-class Expo SDK 51 integration — auto-linked from `modules/`.
- Modern Swift API (`Module { … }`) without the `@objc` boilerplate.
- Async functions return Swift types directly, no manual `RCTPromiseResolveBlock` plumbing.
