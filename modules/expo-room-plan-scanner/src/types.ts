export interface RoomScanSummary {
  /** Number of distinct walls detected. */
  wallsCount: number;
  /** Combined count of doors + windows + openings. */
  openingsCount: number;
  /** Number of detected furniture/fixture objects. */
  objectsCount: number;
  /** Rough bounding-box floor area in square meters. May be null on sparse scans. */
  estimatedFloorArea: number | null;
  /** Median wall height in meters. May be null if no walls were captured. */
  estimatedCeilingHeight: number | null;
}

export interface RoomScanResult {
  /** The roomId originally passed into startRoomScan(). Echoed back for correlation. */
  roomId: string;
  /** Absolute path to the JSON dump of the CapturedRoom (always present on success). */
  localJsonPath: string;
  /** Absolute path to a USDZ export of the room. Null if export failed. */
  localModelPath: string | null;
  /** Parsed CapturedRoom JSON. May be null if re-parsing the on-disk JSON failed. */
  rawJson: Record<string, unknown> | null;
  summary: RoomScanSummary;
}

export type RoomPlanErrorCode =
  | 'E_UNSUPPORTED_OS'
  | 'E_UNSUPPORTED_DEVICE'
  | 'E_FRAMEWORK_MISSING'
  | 'E_NO_PRESENTER'
  | 'E_SCAN_CANCELLED'
  | 'E_SCAN_FAILED';

export interface ExpoRoomPlanScannerNativeModule {
  isRoomPlanSupported(): Promise<boolean>;
  startRoomScan(roomId: string): Promise<RoomScanResult>;
}
