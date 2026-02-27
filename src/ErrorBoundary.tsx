import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            padding: "2rem",
            background: "#0f0f12",
            color: "#e4e4e7",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Erro ao carregar a aplicação</h1>
          <pre
            style={{
              background: "#18181b",
              padding: "1rem",
              borderRadius: "8px",
              overflow: "auto",
              fontSize: "0.875rem",
              color: "#f87171",
            }}
          >
            {this.state.error.message}
          </pre>
          <p style={{ marginTop: "1rem", color: "#a1a1aa", fontSize: "0.875rem" }}>
            Abra o DevTools (F12) → Console para mais detalhes.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
