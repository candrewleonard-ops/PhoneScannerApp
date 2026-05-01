import { requireNativeModule } from 'expo-modules-core';

import type { ExpoRoomPlanScannerNativeModule } from './types';

export type { RoomScanResult, RoomScanSummary, RoomPlanErrorCode } from './types';

const ExpoRoomPlanScanner = requireNativeModule<ExpoRoomPlanScannerNativeModule>('ExpoRoomPlanScanner');

export default ExpoRoomPlanScanner;
