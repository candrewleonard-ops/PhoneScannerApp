import ExpoModulesCore
import UIKit

#if canImport(RoomPlan)
import RoomPlan
#endif

/// Expo Module bridge that exposes Apple's RoomPlan scanner to React Native.
///
/// JS-facing API (see `modules/expo-room-plan-scanner/src/types.ts`):
///   - isRoomPlanSupported(): Promise<boolean>
///   - startRoomScan(roomId: string): Promise<RoomScanResult>
///
/// All scanner functionality requires iOS 16.0+ and a LiDAR-equipped device.
/// The module is built with availability + canImport guards so it compiles
/// on older SDKs and gracefully reports `E_UNSUPPORTED_OS` /
/// `E_UNSUPPORTED_DEVICE` at runtime.
public class RoomPlanScanner: Module {
  public func definition() -> ModuleDefinition {
    // Name JS uses: requireNativeModule('ExpoRoomPlanScanner')
    Name("ExpoRoomPlanScanner")

    AsyncFunction("isRoomPlanSupported") { () -> Bool in
      if #available(iOS 16.0, *) {
        #if canImport(RoomPlan)
        return RoomCaptureSession.isSupported
        #else
        return false
        #endif
      }
      return false
    }

    AsyncFunction("startRoomScan") { (roomId: String, promise: Promise) in
      DispatchQueue.main.async {
        guard #available(iOS 16.0, *) else {
          promise.reject("E_UNSUPPORTED_OS", "RoomPlan requires iOS 16.0 or newer.")
          return
        }

        #if canImport(RoomPlan)
        guard RoomCaptureSession.isSupported else {
          promise.reject(
            "E_UNSUPPORTED_DEVICE",
            "This device does not support RoomPlan. A LiDAR-equipped iPhone or iPad is required."
          )
          return
        }

        guard let presenter = Self.topMostViewController() else {
          promise.reject("E_NO_PRESENTER", "Could not find a view controller to present the scanner.")
          return
        }

        let scannerVC = RoomCaptureViewController(roomId: roomId) { result in
          presenter.dismiss(animated: true) {
            switch result {
            case .success(let payload):
              promise.resolve(payload)
            case .failure(let error):
              let nsError = error as NSError
              let code = nsError.userInfo["code"] as? String ?? "E_SCAN_FAILED"
              promise.reject(code, nsError.localizedDescription)
            }
          }
        }
        scannerVC.modalPresentationStyle = .fullScreen
        presenter.present(scannerVC, animated: true)
        #else
        promise.reject("E_FRAMEWORK_MISSING", "RoomPlan framework is not available in this build.")
        #endif
      }
    }
  }

  /// Walks the active scene to find the top-most view controller suitable for presentation.
  /// Uses the modern UIScene API (avoids deprecated `UIApplication.shared.windows`).
  private static func topMostViewController() -> UIViewController? {
    let scenes = UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .filter { $0.activationState == .foregroundActive }

    let keyWindow = scenes
      .flatMap(\.windows)
      .first(where: \.isKeyWindow) ?? scenes.first?.windows.first

    var topVC = keyWindow?.rootViewController
    while let presented = topVC?.presentedViewController {
      topVC = presented
    }
    return topVC
  }
}
