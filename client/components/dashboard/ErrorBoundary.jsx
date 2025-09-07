"use client";
import React from "react";

export class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// Could forward to logging service
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
						Sorry, something went wrong loading this section.
					</div>
				)
			);
		}
		return this.props.children;
	}
}
