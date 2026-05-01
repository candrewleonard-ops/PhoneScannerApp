import { Platform } from 'react-native';

import ExpoRoomPlanScanner, {
  RoomPlanErrorCode,
  RoomScanResult,
  RoomScanSummary,
} from '../../modules/expo-room-plan-scanner/src';

export type { RoomScanResult, RoomScanSummary, RoomPlanErrorCode };

export class RoomPlanError extends Error {
  readonly code: RoomPlanErrorCode | string;

  constructor(code: RoomPlanErrorCode | string, message: string) {
    super(message);
    this.name = 'RoomPlanError';
    this.code = code;
  }
}

/**
 * Resolves true only on iOS 16+ devices with a LiDAR scanner.
 * Always false on Android, simulator, and unsupported iPhones/iPads.
 */
export async function isRoomPlanSupported(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;
  try {
    return await ExpoRoomPlanScanner.isRoomPlanSupported();
  } catch (err) {
    console.warn('[RoomPlanScanner] isRoomPlanSupported threw:', err);
    return false;
  }
}

/**
 * Presents the native RoomPlan scanner UI modally. Resolves with the captured
 * geometry when the user finishes, or rejects with `RoomPlanError` if the user
 * cancels, the device is unsupported, or processing fails.
 */
export async function startRoomScan(roomId: string): Promise<RoomScanResult> {
  if (Platform.OS !== 'ios') {
    throw new RoomPlanError('E_UNSUPPORTED_OS', 'RoomPlan is only available on iOS.');
  }
  if (!roomId) {
    throw new RoomPlanError('E_INVALID_ARGUMENT', 'A roomId is required to start a scan.');
  }
  try {
    return await ExpoRoomPlanScanner.startRoomScan(roomId);
  } catch (err) {
    const e = err as { code?: string; message?: string };
    throw new RoomPlanError(e.code ?? 'E_SCAN_FAILED', e.message ?? 'Scan failed.');
  }
}

export default {
  isRoomPlanSupported,
  startRoomScan,
};
