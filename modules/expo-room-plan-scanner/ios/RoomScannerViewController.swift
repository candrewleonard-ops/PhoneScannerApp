import UIKit

#if canImport(RoomPlan)
import RoomPlan
import ARKit

/// Presents the RoomPlan capture UI and returns a serialized result via a completion handler.
///
/// Result dictionary shape (matches the JS `RoomScanResult` type):
///   {
///     localJsonPath: String,
///     localModelPath: String?,        // .usdz, may be null if export failed
///     rawJson: [String: Any]?,        // full CapturedRoom JSON
///     summary: {
///       wallsCount: Int,
///       openingsCount: Int,           // doors + windows + openings
///       objectsCount: Int,
///       estimatedFloorArea: Double?,  // meters^2; rough bounding-box estimate
///       estimatedCeilingHeight: Double? // meters; median wall height
///     }
///   }
@available(iOS 16.0, *)
final class RoomScannerViewController: UIViewController, RoomCaptureViewDelegate, RoomCaptureSessionDelegate {

  // MARK: - Public API

  typealias Completion = (Result<[String: Any], Error>) -> Void

  init(roomId: String, completion: @escaping Completion) {
    self.roomId = roomId
    self.completion = completion
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  // MARK: - State

  private let roomId: String
  private let completion: Completion
  private var captureView: RoomCaptureView!
  private var sessionConfig = RoomCaptureSession.Configuration()
  private var didFinish = false

  // MARK: - Lifecycle

  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .black
    setupCaptureView()
    setupControls()
  }

  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    captureView.captureSession.run(configuration: sessionConfig)
  }

  override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated)
    captureView.captureSession.stop()
  }

  // MARK: - Setup

  private func setupCaptureView() {
    captureView = RoomCaptureView(frame: view.bounds)
    captureView.captureSession.delegate = self
    captureView.delegate = self
    captureView.translatesAutoresizingMaskIntoConstraints = false
    view.addSubview(captureView)

    NSLayoutConstraint.activate([
      captureView.topAnchor.constraint(equalTo: view.topAnchor),
      captureView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
      captureView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      captureView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
    ])
  }

  private func setupControls() {
    let cancelButton = makeButton(title: "Cancel", weight: .medium, action: #selector(handleCancel))
    let doneButton = makeButton(title: "Done", weight: .semibold, action: #selector(handleDone))
    view.addSubview(cancelButton)
    view.addSubview(doneButton)

    NSLayoutConstraint.activate([
      cancelButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 12),
      cancelButton.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 16),
      doneButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 12),
      doneButton.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -16),
    ])
  }

  private func makeButton(title: String, weight: UIFont.Weight, action: Selector) -> UIButton {
    let button = UIButton(type: .system)
    button.setTitle(title, for: .normal)
    button.setTitleColor(.white, for: .normal)
    button.titleLabel?.font = .systemFont(ofSize: 17, weight: weight)
    button.translatesAutoresizingMaskIntoConstraints = false
    button.addTarget(self, action: action, for: .touchUpInside)
    button.contentEdgeInsets = UIEdgeInsets(top: 6, left: 12, bottom: 6, right: 12)
    button.backgroundColor = UIColor.black.withAlphaComponent(0.4)
    button.layer.cornerRadius = 6
    return button
  }

  // MARK: - Actions

  @objc private func handleCancel() {
    captureView.captureSession.stop()
    finish(.failure(makeError(code: "E_SCAN_CANCELLED", message: "Scan cancelled by user.")))
  }

  @objc private func handleDone() {
    // Triggers RoomCaptureViewDelegate callbacks once processing is complete.
    captureView.captureSession.stop()
  }

  // MARK: - RoomCaptureViewDelegate

  func captureView(shouldPresent roomDataForProcessing: CapturedRoomData, error: Error?) -> Bool {
    if let error = error {
      finish(.failure(error))
      return false
    }
    return true
  }

  func captureView(didPresent processedResult: CapturedRoom, error: Error?) {
    if let error = error {
      finish(.failure(error))
      return
    }
    do {
      let payload = try buildResult(room: processedResult)
      finish(.success(payload))
    } catch {
      finish(.failure(error))
    }
  }

  // MARK: - Result building

  private func buildResult(room: CapturedRoom) throws -> [String: Any] {
    let outputDir = try ensureOutputDirectory()
    let timestamp = Int(Date().timeIntervalSince1970)

    // Encode CapturedRoom (Codable) to JSON and save.
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
    let jsonData = try encoder.encode(room)
    let jsonURL = outputDir.appendingPathComponent("scan-\(timestamp).json")
    try jsonData.write(to: jsonURL, options: .atomic)

    // Try to export a USDZ model. Failure here is non-fatal.
    var modelPath: String? = nil
    let modelURL = outputDir.appendingPathComponent("scan-\(timestamp).usdz")
    do {
      try room.export(to: modelURL)
      modelPath = modelURL.path
    } catch {
      NSLog("[RoomPlanScanner] USDZ export failed: \(error.localizedDescription)")
    }

    let rawJson = (try? JSONSerialization.jsonObject(with: jsonData, options: [])) as? [String: Any]

    let openingsCount = room.openings.count + room.doors.count + room.windows.count
    let summary: [String: Any] = [
      "wallsCount": room.walls.count,
      "openingsCount": openingsCount,
      "objectsCount": room.objects.count,
      "estimatedFloorArea": estimateFloorArea(walls: room.walls) ?? NSNull(),
      "estimatedCeilingHeight": estimateCeilingHeight(walls: room.walls) ?? NSNull(),
    ]

    return [
      "localJsonPath": jsonURL.path,
      "localModelPath": modelPath ?? NSNull(),
      "rawJson": rawJson ?? NSNull(),
      "summary": summary,
    ]
  }

  private func ensureOutputDirectory() throws -> URL {
    let docs = try FileManager.default.url(
      for: .documentDirectory,
      in: .userDomainMask,
      appropriateFor: nil,
      create: true
    )
    let dir = docs.appendingPathComponent("RoomScans/\(roomId)", isDirectory: true)
    try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
    return dir
  }

  /// Median wall height (Y dimension) in meters — a reasonable proxy for ceiling height.
  private func estimateCeilingHeight(walls: [CapturedRoom.Surface]) -> Double? {
    let heights = walls.map { Double($0.dimensions.y) }.sorted()
    guard !heights.isEmpty else { return nil }
    return heights[heights.count / 2]
  }

  /// Rough axis-aligned bounding-box floor area, in meters². The Phase 4 parsing layer
  /// can produce a much better polygon-area estimate from `rawJson`.
  /// TODO(phase-4): replace with shoelace formula on RoomPlan floor polygon (iOS 17+) or
  /// computed wall corners (iOS 16).
  private func estimateFloorArea(walls: [CapturedRoom.Surface]) -> Double? {
    guard !walls.isEmpty else { return nil }
    var minX: Float = .greatestFiniteMagnitude
    var maxX: Float = -.greatestFiniteMagnitude
    var minZ: Float = .greatestFiniteMagnitude
    var maxZ: Float = -.greatestFiniteMagnitude

    for wall in walls {
      let position = wall.transform.columns.3
      let halfX = wall.dimensions.x / 2
      minX = min(minX, position.x - halfX)
      maxX = max(maxX, position.x + halfX)
      minZ = min(minZ, position.z - halfX)
      maxZ = max(maxZ, position.z + halfX)
    }

    let width = Double(maxX - minX)
    let depth = Double(maxZ - minZ)
    let area = width * depth
    return area > 0 ? area : nil
  }

  // MARK: - Helpers

  private func finish(_ result: Result<[String: Any], Error>) {
    guard !didFinish else { return }
    didFinish = true
    completion(result)
  }

  private func makeError(code: String, message: String) -> NSError {
    NSError(
      domain: "ExpoRoomPlanScanner",
      code: 0,
      userInfo: [
        NSLocalizedDescriptionKey: message,
        "code": code,
      ]
    )
  }
}
#endif
