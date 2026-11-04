import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = 'overview';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="pt-24 pb-16 flex flex-col items-center justify-center text-center px-4">
          <div className="w-full max-w-md p-8 rounded-3xl bg-[#F0F4F9] shadow-[12px_12px_28px_#D0DCED,-12px_-12px_28px_#FFFFFF] border border-white/90">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center neo-pressed text-rose-500 mb-5">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">
              Something went wrong
            </h2>
            <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
              An unexpected render issue occurred. Our system has safely protected your session data.
            </p>
            {this.state.error && (
              <div className="neo-inset p-3 rounded-xl text-[11px] font-mono text-slate-600 mb-6 text-left overflow-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-2xl neo-btn text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Page
              </button>
              <a
                href="#overview"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-5 py-2.5 rounded-2xl neo-pill text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-2"
              >
                <Home className="w-3.5 h-3.5" />
                Overview
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

