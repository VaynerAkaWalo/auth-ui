import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="brutal-border-light bg-surface p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <p className="text-xs font-mono text-muted tracking-[0.3em] uppercase mb-2">Error</p>
              <div className="w-12 h-0.5 bg-foreground mx-auto" />
            </div>
            <p className="text-sm font-mono text-muted mb-6">Something went wrong</p>
            {this.state.error ? (
              <pre className="text-xs font-mono text-destructive mb-6 text-left max-h-32 overflow-auto whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            ) : null}
            <button
              onClick={() => window.location.reload()}
              className="brutal-border bg-foreground text-background hover:bg-transparent hover:text-foreground text-xs tracking-[0.15em] uppercase font-mono h-auto py-3 px-8 transition-colors duration-150 cursor-pointer"
            >
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
