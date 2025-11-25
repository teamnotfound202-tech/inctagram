'use client'
import React, {Component, ReactNode} from 'react';
import {CommonError} from "@/shared/components/ErrorBoundary/ui/CommonError";

type ErrorBoundaryProps = {
    children: ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error: Error) {
        // Обновить состояние, чтобы показать fallback UI
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Можно залогировать ошибку куда-нибудь
        console.error('Uncaught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Можно вернуть любой UI fallback
            return <CommonError/>
        }

        return this.props.children;
    }
}

export default ErrorBoundary;