import UIKit

#if canImport(RoomPlan)
import RoomPlan
import ARKit

/// Hosts Apple's `RoomCaptureView` and returns a serialized result via a completion handler.
///
/// Result dictionary shape (matches the JS `RoomScanResult` type):
///   {
///     roomId: String,
///     localJsonPath: String,
///     localModelPath: String?,           // .usdz, may be null if export failed
///     rawJson: [String: Any]?,           // full CapturedRoom JSON
///     summary: {
///       wallsCount: Int,
///       openingsCount: Int,              // doors + windows + openings
///       objectsCount: Int,
///       estimatedFloorArea: Double?,     // m^2; rough bounding-box estimate
///       estimatedCeilingHeight: Double?  // m; median wall height
///     }
///   }
///
/// Lifecycle:
///   viewDidLoad     -> build UI
///   viewDidAppear   -> session.run(...)
///   user taps Done  -> session.stop() (triggers RoomCaptureViewDelegate processing)
///   delegate done   -> build result dict, invoke completion(.success)
///   user taps Cancel-> session.stop() and completion(.failure(E_SCAN_CANCELLED))
@available(iOS 16.0, *)
final class RoomCaptureViewController: UIViewController, RoomCaptureViewDelegate, RoomCaptureSessionDelegate {

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
  private var statusLabel: UILabel!
  private var doneButton: UIButton!
  private var processingOverlay: UIView!

  // MARK: - Lifecycle

  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .black
    setupCaptureView()
    setupControls()
    setupProcessingOverlay()
  }

  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    captureView.captureSession.run(configuration: sessionConfig)
  }

  override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated)
    captureView.captureSession.stop()
  }

  // MARK: - View setup

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
    doneButton = makeButton(title: "Done", weight: .semibold, action: #selector(handleDone))

    statusLabel = UILabel()
    statusLabel.text = "Move slowly to scan walls, doors, and windows"
    statusLabel.textColor = .white
    statusLabel.font = .systemFont(ofSize: 14, weight: .medium)
    statusLabel.numberOfLines = 0
    statusLabel.textAlignment = .center
    statusLabel.translatesAutoresizingMaskIntoConstraints = false
    statusLabel.backgroundColor = UIColor.black.withAlphaComponent(0.55)
    statusLabel.layer.cornerRadius = 6
    statusLabel.layer.masksToBounds = true
    statusLabel.adjustsFontSizeToFitWidth = true
    statusLabel.minimumScaleFactor = 0.8

    view.addSubview(cancelButton)
    view.addSubview(doneButton)
    view.addSubview(statusLabel)

    NSLayoutConstraint.activate([
      cancelButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 12),
      cancelButton.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 16),
      doneButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 12),
      doneButton.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -16),
      statusLabel.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -24),
      statusLabel.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 24),
      statusLabel.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -24),
      statusLabel.heightAnchor.constraint(greaterThanOrEqualToConstant: 36),
    ])
  }

  private func makeButton(title: String, weight: UIFont.Weight, action: Selector) -> UIButton {
    let button = UIButton(type: .system)
    button.setTitle(title, for: .normal)
    button.setTitleColor(.white, for: .normal)
    button.titleLabel?.font = .systemFont(ofSize: 17, weight: weight)
    button.translatesAutoresizingMaskIntoConstraints = false
    button.addTarget(self, action: action, for: .touchUpInside)
    button.contentEdgeInsets = UIEdgeInsets(top: 8, left: 14, bottom: 8, right: 14)
    button.backgroundColor = UIColor.black.withAlphaComponent(0.45)
    button.layer.cornerRadius = 8
    return button
  }

  private func setupProcessingOverlay() {
    processingOverlay = UIView()
    processingOverlay.backgroundColor = UIColor.black.withAlphaComponent(0.65)
    processingOverlay.translatesAutoresizingMaskIntoConstraints = false
    processingOverlay.isHidden = true

    let spinner = UIActivityIndicatorView(style: .large)
    spinner.color = .white
    spinner.startAnimating()
    spinner.translatesAutoresizingMaskIntoConstraints = false

    let label = UILabel()
    label.text = "Processing scan…"
    label.textColor = .white
    label.font = .systemFont(ofSize: 16, weight: .medium)
    label.translatesAutoresizingMaskIntoConstraints = false

    processingOverlay.addSubview(spinner)
    processingOverlay.addSubview(label)
    view.addSubview(processingOverlay)

    NSLayoutConstraint.activate([
      processingOverlay.topAnchor.constraint(equalTo: view.topAnchor),
      processingOverlay.bottomAnchor.constraint(equalTo: view.bottomAnchor),
      processingOverlay.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      processingOverlay.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      spinner.centerXAnchor.constraint(equalTo: processingOverlay.centerXAnchor),
      spinner.centerYAnchor.constraint(equalTo: processingOverlay.centerYAnchor, constant: -16),
      label.topAnchor.constraint(equalTo: spinner.bottomAnchor, constant: 12),
      label.centerXAnchor.constraint(equalTo: processingOverlay.centerXAnchor),
    ])
  }

  // MARK: - Actions

  @objc private func handleCancel() {
    captureView.captureSession.stop()
    finish(.failure(makeError(code: "E_SCAN_CANCELLED", message: "Scan cancelled by user.")))
  }

  @objc private func handleDone() {
    // Stopping the session triggers RoomCaptureViewDelegate processing callbacks.
    doneButton.isEnabled = false
    statusLabel.text = "Finalizing scan…"
    processingOverlay.isHidden = false
    captureView.captureSession.stop()
  }

  // MARK: - RoomCaptureSessionDelegate (live updates)

  func captureSession(_ session: RoomCaptureSession, didUpdate room: CapturedRoom) {
    // Lightweight live progress text — RoomCaptureView itself draws the AR overlay.
    let walls = room.walls.count
    let openings = room.doors.count + room.windows.count + room.openings.count
    let objects = room.objects.count
    statusLabel.text = "Walls \(walls)  ·  Openings \(openings)  ·  Objects \(objects)"
  }

  func captureSession(_ session: RoomCaptureSession, didFailWith error: Error) {
    finish(.failure(error))
  }

  // MARK: - RoomCaptureViewDelegate (post-processing)

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

    // 1. Encode CapturedRoom (Codable on iOS 16+) to JSON and save to disk.
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
    let jsonData = try encoder.encode(room)
    let jsonURL = outputDir.appendingPathComponent("scan-\(timestamp).json")
    try jsonData.write(to: jsonURL, options: .atomic)

    // 2. Best-effort USDZ export. Failure is non-fatal — JSON is the source of truth.
    var modelPath: String? = nil
    let modelURL = outputDir.appendingPathComponent("scan-\(timestamp).usdz")
    do {
      try room.export(to: modelURL)
      modelPath = modelURL.path
    } catch {
      NSLog("[RoomPlanScanner] USDZ export failed: \(error.localizedDescription)")
    }

    // 3. Re-parse JSON for pass-through to JS (Foundation can encode it back to RN bridge).
    let rawJson = (try? JSONSerialization.jsonObject(with: jsonData, options: [])) as? [String: Any]

    // 4. Compute summary.
    let openingsCount = room.openings.count + room.doors.count + room.windows.count
    let summary: [String: Any] = [
      "wallsCount": room.walls.count,
      "openingsCount": openingsCount,
      "objectsCount": room.objects.count,
      "estimatedFloorArea": estimateFloorArea(walls: room.walls) ?? NSNull(),
      "estimatedCeilingHeight": estimateCeilingHeight(walls: room.walls) ?? NSNull(),
    ]

    return [
      "roomId": roomId,
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

  /// Median wall height (Y dimension), in meters. A reasonable proxy for ceiling height.
  private func estimateCeilingHeight(walls: [CapturedRoom.Surface]) -> Double? {
    let heights = walls.map { Double($0.dimensions.y) }.sorted()
    guard !heights.isEmpty else { return nil }
    return heights[heights.count / 2]
  }

  /// Rough axis-aligned bounding-box floor area, in m². RoomPlan does not expose a
  /// floor polygon directly (walls/doors/windows/openings/objects only), so we derive
  /// extents from wall transforms. Phase 4 parsing of `rawJson` can refine this with
  /// a polygon (shoelace) area computed from wall corners.
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
      domain: "RoomPlanScanner",
      code: 0,
      userInfo: [
        NSLocalizedDescriptionKey: message,
        "code": code,
      ]
    )
  }
}
#endif
