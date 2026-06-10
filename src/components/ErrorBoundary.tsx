import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[ErrorBoundary] 捕获到渲染错误:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    color: 'var(--gray-light)',
                    fontFamily: 'sans-serif',
                    gap: '16px',
                    padding: '32px',
                }}>
                    <div style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: 'var(--yellow)',
                    }}>
                        出错了
                    </div>
                    <div style={{
                        fontSize: '14px',
                        color: 'var(--gray)',
                        maxWidth: '600px',
                        textAlign: 'center',
                        lineHeight: 1.6,
                    }}>
                        {this.state.error?.message || '未知渲染错误'}
                    </div>
                    <button
                        onClick={this.handleReset}
                        style={{
                            marginTop: '16px',
                            padding: '8px 24px',
                            fontSize: '14px',
                            border: '1px solid var(--gray)',
                            borderRadius: '6px',
                            background: 'transparent',
                            color: 'var(--gray-light)',
                            cursor: 'pointer',
                        }}
                    >
                        重试
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
