import SwiftUI

@available(iOS 17, macOS 14, *)
struct FluxScreenStyle: ViewModifier {
  func body(content: Content) -> some View {
    content
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
      .background(
        LinearGradient(
          colors: [
            Color(red: 0.03, green: 0.04, blue: 0.08),
            Color(red: 0.01, green: 0.02, blue: 0.05)
          ],
          startPoint: .topLeading,
          endPoint: .bottomTrailing
        )
      )
  }
}

@available(iOS 17, macOS 14, *)
struct FluxCard<Content: View>: View {
  private let content: Content

  init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  var body: some View {
    content
      .padding(16)
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(Color.white.opacity(0.05))
      .clipShape(.rect(cornerRadius: 18))
      .overlay(
        RoundedRectangle(cornerRadius: 18)
          .stroke(Color.white.opacity(0.1), lineWidth: 1)
      )
  }
}

@available(iOS 17, macOS 14, *)
struct FluxMetricPill: View {
  private let title: String
  private let value: String

  init(title: String, value: String) {
    self.title = title
    self.value = value
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      Text(title)
        .font(.caption.weight(.semibold))
        .foregroundStyle(.white.opacity(0.7))
      Text(value)
        .font(.headline.weight(.semibold))
        .foregroundStyle(.white)
    }
    .padding(.horizontal, 12)
    .padding(.vertical, 10)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(Color.white.opacity(0.05))
    .clipShape(.rect(cornerRadius: 12))
  }
}

@available(iOS 17, macOS 14, *)
struct FluxPrimaryButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.headline.weight(.semibold))
      .foregroundStyle(Color.black.opacity(0.85))
      .frame(maxWidth: .infinity)
      .padding(.vertical, 14)
      .background(configuration.isPressed ? Color.orange.opacity(0.75) : Color.orange)
      .clipShape(.rect(cornerRadius: 12))
  }
}

@available(iOS 17, macOS 14, *)
struct FluxSecondaryButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.headline.weight(.semibold))
      .foregroundStyle(Color.white)
      .frame(maxWidth: .infinity)
      .padding(.vertical, 14)
      .background(configuration.isPressed ? Color.white.opacity(0.12) : Color.white.opacity(0.08))
      .clipShape(.rect(cornerRadius: 12))
      .overlay(
        RoundedRectangle(cornerRadius: 12)
          .stroke(Color.white.opacity(0.15), lineWidth: 1)
      )
  }
}

@available(iOS 17, macOS 14, *)
struct FluxInputFieldStyle: ViewModifier {
  func body(content: Content) -> some View {
    content
      .font(.body.weight(.medium))
      .foregroundStyle(.white)
      .padding(.horizontal, 14)
      .padding(.vertical, 12)
      .background(Color.white.opacity(0.06))
      .clipShape(.rect(cornerRadius: 12))
      .overlay(
        RoundedRectangle(cornerRadius: 12)
          .stroke(Color.white.opacity(0.12), lineWidth: 1)
      )
  }
}

@available(iOS 17, macOS 14, *)
extension View {
  func fluxScreenStyle() -> some View {
    modifier(FluxScreenStyle())
  }

  func fluxInputFieldStyle() -> some View {
    modifier(FluxInputFieldStyle())
  }
}
