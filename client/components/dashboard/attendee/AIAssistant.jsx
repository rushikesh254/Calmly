"use client";

// Simple placeholder card for the upcoming AI Assistant feature.
// UI and behavior are intentionally unchanged; this just clarifies structure.
export default function AIAssistant() {
	const containerClass = "max-w-4xl mx-auto";
	const cardClass =
		"rounded-2xl p-8 bg-white/80 dark:bg-slate-800/80 shadow-lg border border-slate-200/60 dark:border-slate-700/60";
	const titleClass = "text-2xl font-bold text-slate-900 dark:text-white mb-3";
	const descriptionClass = "text-slate-600 dark:text-slate-400";

	return (
		<div className={containerClass}>
			<div className={cardClass}>
				<h2 className={titleClass}>AI Assistant</h2>
				<p className={descriptionClass}>
					This feature is coming soon. You&apos;ll be able to chat with an AI
					assistant for quick support and guidance.
				</p>
			</div>
		</div>
	);
}
