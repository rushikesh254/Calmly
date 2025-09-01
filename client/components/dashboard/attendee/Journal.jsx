"use client";

import { useEffect, useState } from "react";

const getToken = () =>
	(typeof window !== "undefined" &&
		(localStorage.getItem("token") || localStorage.getItem("accessToken"))) ||
	null;

export default function Journal() {
	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [editingId, setEditingId] = useState(null);

	const fetchEntries = async () => {
		setLoading(true);
		setError("");
		try {
			const token = getToken();
			if (!token) throw new Error("Sign in required.");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/journal?limit=50`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to load journal");
			setEntries(data.items || []);
		} catch (e) {
			setError(e.message || "Failed to load journal");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEntries();
	}, []);

	const resetForm = () => {
		setTitle("");
		setContent("");
		setEditingId(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = getToken();
			if (!token) throw new Error("Sign in required.");
			const method = editingId ? "PUT" : "POST";
			const url = editingId
				? `${process.env.NEXT_PUBLIC_API_URL}/api/journal/${editingId}`
				: `${process.env.NEXT_PUBLIC_API_URL}/api/journal`;
			const res = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ title, content }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to save entry");
			resetForm();
			fetchEntries();
		} catch (e) {
			setError(e.message || "Failed to save entry");
		}
	};

	const handleEdit = (entry) => {
		setEditingId(entry._id);
		setTitle(entry.title || "");
		setContent(entry.content || "");
	};

	const handleDelete = async (id) => {
		if (!confirm("Delete this entry?")) return;
		try {
			const token = getToken();
			if (!token) throw new Error("Sign in required.");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/journal/${id}`,
				{ method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
			);
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed to delete");
			}
			fetchEntries();
		} catch (e) {
			setError(e.message || "Failed to delete");
		}
	};

	return (
		<section id="journal" className="mb-12">
			<h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-6">
				Journal
			</h2>

			{error && (
				<div className="mb-4 p-3 rounded-lg border border-red-400/50 bg-red-500/10 dark:bg-red-950/30 dark:border-red-900/40 text-red-700 dark:text-red-300">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="mb-6 space-y-3">
				<input
					type="text"
					placeholder="Title (optional)"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-full px-4 py-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
				/>
				<textarea
					placeholder="Write your thoughts..."
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows={5}
					className="w-full px-4 py-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
					required
				/>
				<div className="flex gap-2">
					<button
						type="submit"
						className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
						{editingId ? "Update Entry" : "Add Entry"}
					</button>
					{editingId && (
						<button
							type="button"
							onClick={resetForm}
							className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
							Cancel
						</button>
					)}
				</div>
			</form>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{loading ? (
					<div className="p-6 text-slate-600 dark:text-slate-400">
						Loading...
					</div>
				) : entries.length === 0 ? (
					<div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
						No entries yet. Start by writing your first thought above.
					</div>
				) : (
					entries.map((e) => (
						<div
							key={e._id}
							className="p-5 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all">
							<div className="flex items-start justify-between gap-3">
								<div>
									<div className="text-sm text-slate-500 dark:text-slate-400">
										{new Date(e.createdAt).toLocaleString()}
									</div>
									<div className="font-semibold text-slate-900 dark:text-white">
										{e.title || "Untitled"}
									</div>
								</div>
								<div className="flex gap-2">
									<button
										className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
										onClick={() => handleEdit(e)}>
										Edit
									</button>
									<button
										className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
										onClick={() => handleDelete(e._id)}>
										Delete
									</button>
								</div>
							</div>
							<p className="mt-3 whitespace-pre-wrap text-slate-700 dark:text-slate-200">
								{e.content}
							</p>
						</div>
					))
				)}
			</div>
		</section>
	);
}
