"use client";
import React, { useState, useEffect, useRef } from "react";

/**
 * Resource creation form for MH Admin / MHP users.
 * Supports: Article (headline + content) or Video (description + upload to Cloudinary via signed request).
 * Styling and markup preserved exactly; only structure, comments, and resilience improved.
 */
export const Resources = ({ userName, email }) => {
	// -------------------- Form State --------------------
	const [title, setTitle] = useState("");
	const [headline, setHeadline] = useState("");
	const [type, setType] = useState("article");
	const [content, setContent] = useState("");
	const [videoDescription, setVideoDescription] = useState("");
	const [video, setVideo] = useState(null);
	const [categories, setCategories] = useState([]);
	const [uploading, setUploading] = useState(false);
	// message: { text: string, type: 'success' | 'error' }
	const [message, setMessage] = useState(null);
	const dismissTimerRef = useRef(null);

	// -------------------- Constants --------------------
	const API_BASE = process.env.NEXT_PUBLIC_API_URL;
	const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

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
		"Sleep Disorders",
		"Anger Management",
		"Workplace Mental Health",
	];

	// -------------------- Handlers --------------------
	const handleVideoChange = (e) => setVideo(e.target.files[0] || null);

	// Auto-dismiss success notifications after 4s
	useEffect(() => {
		if (message?.type === 'success') {
			dismissTimerRef.current && clearTimeout(dismissTimerRef.current);
			dismissTimerRef.current = setTimeout(() => setMessage(null), 4000);
		}
		return () => {
			if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
		};
	}, [message]);

	const toggleCategory = (value) =>
		setCategories((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUploading(true);
		setMessage(null);
		try {
			const token =
				(typeof window !== "undefined" && localStorage.getItem("accessToken")) ||
				(typeof window !== "undefined" && localStorage.getItem("token"));
			if (!token) {
				setMessage({ type: 'error', text: 'Sign in required. Please log in as admin or MHP.' });
				return;
			}

			let mediaUrl = "";
			if (type === "video" && video) {
				// 1. Request upload signature from backend
				const sigResponse = await fetch(`${API_BASE}/api/sign-upload`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ folder: "Videos" }),
				});
				if (!sigResponse.ok) throw new Error("Failed to get upload signature");
				const { timestamp, signature, api_key } = await sigResponse.json();

				// 2. Send file to Cloudinary
				const formData = new FormData();
				formData.append("file", video);
				formData.append("timestamp", timestamp);
				formData.append("signature", signature);
				formData.append("api_key", api_key);
				formData.append("folder", "Videos");

				const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;
				const cloudRes = await fetch(uploadUrl, { method: "POST", body: formData });
				if (!cloudRes.ok) throw new Error("Cloud upload failed");
				const cloudData = await cloudRes.json();
				mediaUrl = cloudData.secure_url;
			}

			// 3. Persist resource metadata to backend
			const resourceData = {
				title,
				userName,
				mhpemail: email,
				headline: type === "article" ? headline : "",
				type,
				content: type === "video" ? videoDescription : content,
				mediaUrl: type === "video" ? mediaUrl : "",
				categories: JSON.stringify(categories),
			};

			const resourceRes = await fetch(`${API_BASE}/api/resources`, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify(resourceData),
			});

			if (resourceRes.ok) {
				setMessage({ type: 'success', text: 'Resource added successfully!' });
				// reset form
				setTitle("");
				setHeadline("");
				setContent("");
				setVideoDescription("");
				setVideo(null);
				setCategories([]);
			} else {
				const err = await resourceRes.json().catch(() => null);
				setMessage({ type: 'error', text: err?.error || err?.message || 'Failed to add resource.' });
			}
		} catch (err) {
			setMessage({ type: 'error', text: err?.message || 'Failed to add resource.' });
		} finally {
			setUploading(false);
		}
	};

	// -------------------- Render --------------------
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Live region for announcements */}
			<div aria-live="polite" className="sr-only">{message?.text || ''}</div>
			<div className="mb-8 text-center">
				<h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-2">Upload New Resource</h1>
				<p className="text-gray-600">Share mental health resources with your patients</p>
			</div>

			<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6" noValidate>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
					<input
						type="text"
						className="w-full px-2.5 py-1.5 text-black rounded-xl border-2 border-indigo-100 bg-indigo-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
					<select
						className="w-full px-2.5 py-1.5 rounded-xl border-2 border-indigo-100 bg-indigo-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none appearance-none text-gray-700 font-medium cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0ZjQ2ZTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNiA5bDYgNiA2LTYiLz48L3N2Zz4=')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em] hover:bg-indigo-100"
						value={type}
						onChange={(e) => setType(e.target.value)}
					>
						<option value="article">Article</option>
						<option value="video">Video</option>
					</select>
				</div>

				{type === "article" && (
					<>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
							<input
								type="text"
								className="w-full px-4 py-3 text-black rounded-xl border-2 border-indigo-100 bg-indigo-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none"
								value={headline}
								onChange={(e) => setHeadline(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
							<textarea
								className="w-full px-4 py-3 text-black rounded-xl border-2 border-indigo-100 bg-indigo-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none min-h-[150px]"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								required
							/>
						</div>
					</>
				)}

				{type === "video" && (
					<>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Video Description</label>
							<textarea
								className="w-full px-4 py-3 rounded-xl border-2 border-indigo-100 bg-indigo-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none min-h-[100px]"
								value={videoDescription}
								onChange={(e) => setVideoDescription(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Upload Video</label>
							<div className="flex items-center justify-center w-full">
								<label className="flex flex-col w-full border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors duration-200 p-6 text-center">
									<svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
										<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<span className="text-gray-600 mt-2">{video ? video.name : "Click to select a video file"}</span>
									<input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" required />
								</label>
							</div>
						</div>
					</>
				)}

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-3">Select Categories:</label>
					<div className="flex flex-wrap gap-2">
						{availableCategories.map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => toggleCategory(cat)}
								aria-pressed={categories.includes(cat)}
								className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
									categories.includes(cat) ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
								}`}
							>
								{cat}
							</button>
						))}
					</div>
				</div>

				<button
					type="submit"
					disabled={uploading}
					className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{uploading ? (
						<span className="flex items-center justify-center gap-2">
							<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Uploading...
						</span>
					) : (
						"Publish Resource"
					)}
				</button>

				{message && (
					<div
						role={message.type === 'error' ? 'alert' : 'status'}
						className={`mt-4 p-4 rounded-xl text-sm flex items-start gap-3 border ${
							message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
						}`}
					>
						<svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							{message.type === 'success' ? (
								<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414l2.793 2.793 7.543-7.543a1 1 0 011.414 0z" clipRule="evenodd" />
							) : (
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM10 13.5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
							)}
						</svg>
						<p className="flex-1">{message.text}</p>
						<button onClick={() => setMessage(null)} aria-label="Dismiss message" className="text-gray-500 hover:text-gray-700">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				)}
			</form>
		</div>
	);
};
