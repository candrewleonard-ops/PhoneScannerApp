import ExpoModulesCore
import UIKit

#if canImport(RoomPlan)
import RoomPlan
#endif

public class ExpoRoomPlanScannerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoRoomPlanScanner")

    // Returns true only when the device supports RoomPlan (LiDAR + iOS 16+).
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

    // Presents the RoomPlan scanner UI modally and resolves with the captured result.
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

        let scannerVC = RoomScannerViewController(roomId: roomId) { result in
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
  private static func topMostViewController() -> UIViewController? {
    let scenes = UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .filter { $0.activationState == .foregroundActive }

    let keyWindow = scenes
      .flatMap { $0.windows }
      .first { $0.isKeyWindow } ?? scenes.first?.windows.first

    var topVC = keyWindow?.rootViewController
    while let presented = topVC?.presentedViewController {
      topVC = presented
    }
    return topVC
  }
}
