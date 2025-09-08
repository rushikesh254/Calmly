"use client";
import React, { useState, useEffect, useRef } from "react";

/**
 * Displays previously created resources (articles & videos) with filtering.
 * Allows deletion (with confirmation) and full-article modal view.
 * UI structure and classes preserved; only code clarity improved.
 */
export const ViewResources = () => {
	// -------------------- State --------------------
	const [resources, setResources] = useState([]);
	const [selectedType, setSelectedType] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [selectedArticle, setSelectedArticle] = useState(null);
	const [deletingResourceId, setDeletingResourceId] = useState(null);
	// Inline feedback message { type: 'success' | 'error', text: string }
	const [feedback, setFeedback] = useState(null);
	const contentRef = useRef(null);
	const firstDialogButtonRef = useRef(null); // focus target when dialog opens
	const previousFocusRef = useRef(null); // to restore focus after closing dialogs

	const availableCategories = [
		"Stress Management",
		"Anxiety",
		"Depression",
		"Mindfulness Exercises and Meditation",
		"Bipolar Disorder",
		"Generalized Anxiety Disorder",
		"Social Anxiety Disorder",
		"Panic Disorder",
		"Post-Traumatic Stress Disorder (PTSD)",
		"Obsessive-Compulsive Disorder (OCD)",
		"Attention-Deficit/Hyperactivity Disorder (ADHD)",
		"Sleep Disorders",
		"Anger Management",
		"Workplace Mental Health",
	];

	useEffect(() => {
		const fetchResources = async () => {
			try {
				let url = `${process.env.NEXT_PUBLIC_API_URL}/api/resources?`;
				if (selectedType !== "all") url += `type=${selectedType}&`;
				if (categoryFilter) url += `category=${encodeURIComponent(categoryFilter)}`;

				const response = await fetch(url);
				if (!response.ok) return; // silent fail keeps UX stable
				const data = await response.json();
				setResources(data);
			} catch (err) {
				// Log for debugging while keeping UI minimal
				console.error("Failed to fetch resources", err);
			}
		};
		fetchResources();
	}, [selectedType, categoryFilter]);

	useEffect(() => {
		if (contentRef.current && selectedArticle) {
			contentRef.current.scrollTo(0, 0);
		}
	}, [selectedArticle]);

	// Manage focus when any dialog (article or delete confirm) opens
	useEffect(() => {
		const dialogOpen = selectedArticle || deletingResourceId;
		if (dialogOpen) {
			previousFocusRef.current = document.activeElement;
			setTimeout(() => {
				firstDialogButtonRef.current?.focus();
			}, 0);
		} else if (!dialogOpen && previousFocusRef.current) {
			// restore focus when dialog closes
			(previousFocusRef.current instanceof HTMLElement) && previousFocusRef.current.focus();
		}
	}, [selectedArticle, deletingResourceId]);

	// Auto dismiss success feedback while retaining errors for manual dismissal
	useEffect(() => {
		if (feedback?.type === 'success') {
			const t = setTimeout(() => setFeedback(null), 4000);
			return () => clearTimeout(t);
		}
	}, [feedback]);

	const handleConfirmDelete = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/resources/${deletingResourceId}`,
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ mhpEmail: "mhadmin.rushikesh@gmail.com" }),
				}
			);

			const result = await response.json();
			if (response.ok) {
				setResources(resources.filter((resource) => resource._id !== deletingResourceId));
				setDeletingResourceId(null);
				setFeedback({ type: 'success', text: 'Resource deleted.' });
			} else {
				setFeedback({ type: 'error', text: result.message || 'Failed to delete resource.' });
				setDeletingResourceId(null);
			}
		} catch (err) {
			console.error("Delete error", err);
			setFeedback({ type: 'error', text: 'An unexpected error occurred while deleting.' });
			setDeletingResourceId(null);
		}
	};

	const filteredResources = resources.filter((resource) => (selectedType === "all" ? true : resource.type === selectedType));

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Live region for inline feedback */}
			<div aria-live="polite" className="sr-only">
				{feedback?.text || ''}
			</div>

			{feedback && (
				<div
					className={`mb-6 flex items-start gap-3 p-4 rounded-lg text-sm border ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
					role={feedback.type === 'error' ? 'alert' : 'status'}
				>
					<svg
						className="h-5 w-5 mt-0.5 flex-shrink-0"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						{feedback.type === 'success' ? (
							<path
								fillRule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414l2.793 2.793 7.543-7.543a1 1 0 011.414 0z"
								clipRule="evenodd"
							/>
						) : (
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM10 13.5a1 1 0 100 2 1 1 0 000-2z"
								clipRule="evenodd"
							/>
						)}
					</svg>
					<p className="flex-1">{feedback.text}</p>
					<button
						onClick={() => setFeedback(null)}
						className="text-gray-500 hover:text-gray-700"
						aria-label="Dismiss message"
						ref={firstDialogButtonRef}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			)}
			{/* Article Modal */}
			{selectedArticle && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="article-dialog-title">
					<div className="bg-white rounded-xl w-full max-w-3xl max-h-[90dvh] flex flex-col shadow-xl">
						<div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50 sticky top-0">
							<h2 id="article-dialog-title" className="text-2xl font-bold text-indigo-600 pr-4">
								{selectedArticle.title}
							</h2>
							<button
								ref={firstDialogButtonRef}
								onClick={() => setSelectedArticle(null)}
								className="text-gray-500 hover:text-gray-700 shrink-0"
								aria-label="Close article dialog"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
							</button>
						</div>
						<div className="p-6 overflow-y-auto" ref={contentRef}>
							<div className="space-y-6">
								{selectedArticle.headline && (
									<h3 className="text-xl font-semibold text-gray-800 border-l-4 border-indigo-500 pl-4">
										{selectedArticle.headline}
									</h3>
								)}
								<div className="prose max-w-none text-gray-700 space-y-4">
									{selectedArticle.content
										.split("\n")
										.map((paragraph, index) => (
											<p key={index} className="text-justify leading-relaxed">
												{paragraph}
											</p>
										))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{deletingResourceId && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
					<div className="bg-white rounded-xl w-full max-w-md flex flex-col shadow-xl">
						<div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50 sticky top-0">
							<h2 id="delete-dialog-title" className="text-xl font-bold text-red-600 pr-4">
								Confirm Deletion
							</h2>
							<button
								ref={firstDialogButtonRef}
								onClick={() => setDeletingResourceId(null)}
								className="text-gray-500 hover:text-gray-700 shrink-0"
								aria-label="Close delete dialog"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
							</button>
						</div>
						<div className="p-6">
							<p className="text-gray-700 mb-6">
								Are you sure you want to delete this resource? This action
								cannot be undone.
							</p>
							<div className="flex justify-end gap-3">
								<button
									onClick={() => setDeletingResourceId(null)}
									className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-200 hover:bg-gray-50"
								>
									Cancel
									</button>
								<button
									onClick={handleConfirmDelete}
									className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
								>
									Delete Permanently
									</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="mb-8 text-center">
				<h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-2">
					Resource Library
				</h1>
				<p className="text-gray-600">
					Curated mental health resources and educational materials
				</p>
			</div>

			{/* Filter Section */}
			<div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
				<div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
					<div className="flex gap-2 overflow-x-auto pb-2 w-full">
						{["all", "article", "video"].map((type) => (
							<button
								key={type}
								onClick={() => setSelectedType(type)}
								className={`px-6 py-2 rounded-full text-sm font-medium transition-colors
                  ${
										selectedType === type
											? "bg-indigo-600 text-white"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}>
								{type === "all"
									? "All Resources"
									: `${type.charAt(0).toUpperCase() + type.slice(1)}s`}
							</button>
						))}
					</div>

					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className="w-full sm:w-64 px-4 py-3 rounded-xl border-2 border-indigo-100 bg-indigo-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none appearance-none text-gray-700 font-medium cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0ZjQ2ZTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNiA5bDYgNiA2LTYiLz48L3N2Zz4=')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em] hover:bg-indigo-100">
						<option value="" className="text-gray-400 bg-white">
							All Categories
						</option>
						{availableCategories.map((cat) => (
							<option
								key={cat}
								value={cat}
								className="bg-white text-gray-700 hover:bg-indigo-50 py-2">
								{cat}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Resource Grid */}
			{filteredResources.length ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredResources.map((resource) => (
						<div
							key={resource._id}
							className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden">
							<div className="p-6">
								<div className="flex items-start justify-between mb-4">
									<div>
										<h2 className="text-xl font-semibold text-gray-800 mb-1">
											{resource.title}
										</h2>
										<div className="flex items-center gap-2 text-sm text-gray-500">
											<span className="flex items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4 mr-1"
													viewBox="0 0 20 20"
													fill="currentColor">
													<path
														fillRule="evenodd"
														d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
														clipRule="evenodd"
													/>
												</svg>
												{new Date(resource.createdAt).toLocaleDateString()}
											</span>
										</div>
									</div>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											resource.type === "video"
												? "bg-blue-100 text-blue-800"
												: "bg-teal-100 text-teal-800"
										}`}>
										{resource.type.toUpperCase()}
									</span>
								</div>

								{resource.mhpName && (
									<div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 text-gray-400"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
										</svg>
										{resource.mhpName}
									</div>
								)}

								<div className="mb-4">
									<div className="flex flex-wrap gap-2">
										{resource.categories.map((category) => (
											<span
												key={category}
												className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
												{category}
											</span>
										))}
									</div>
								</div>

								{resource.type === "article" ? (
									<div className="mb-4">
										{resource.headline && (
											<h3 className="text-lg font-semibold text-gray-800 mb-2">
												{resource.headline}
											</h3>
										)}
										<p className="text-gray-600 line-clamp-3 text-sm mb-2">
											{resource.content}
										</p>
										{resource.content.length > 300 && (
											<button
												onClick={() => setSelectedArticle(resource)}
												className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
												Read Full Article →
											</button>
										)}
									</div>
								) : (
									<div className="mb-4">
										<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
											<video
												controls
												className="w-full h-full object-cover"
												src={resource.mediaUrl}
											/>
										</div>
										{resource.content && (
											<div className="mt-2">
												<p className="text-sm font-medium text-gray-700 mb-1">
													Video Description:
												</p>
												<p className="text-gray-600 line-clamp-2 text-sm">
													{resource.content}
												</p>
											</div>
										)}
									</div>
								)}

								<div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
									<button
										onClick={() => setDeletingResourceId(resource._id)}
										className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												fillRule="evenodd"
												d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
										Delete
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
					<p className="text-gray-500">
						No resources found matching your criteria
					</p>
				</div>
			)}
		</div>
	);
};
