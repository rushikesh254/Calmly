"use client";
import { useEffect, useState } from "react";

// Small helpers keep the render clean and focused
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const ADMIN_STATS_ENDPOINT = `${API_BASE}/api/admin/manage/stats`;
const getToken = () =>
	typeof window === "undefined" ? null : localStorage.getItem("accessToken");
const withAuth = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

export const AnalyticsCards = () => {
	const [stats, setStats] = useState(null); // { users, attendees, mhps, sessions, moodLogs }
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const token = getToken();
				const res = await fetch(ADMIN_STATS_ENDPOINT, {
					headers: withAuth(token),
				});
				const data = await res.json();
				if (res.ok && data?.totals) {
					setStats(data.totals);
				} else {
					setError(data?.error || "Failed");
				}
			} catch {
				setError("Network error");
			}
		};
		fetchStats();
	}, []);

	// Shape the display list in one place; rendering stays dumb and predictable
	const items = stats
		? [
				{ label: "Total Users", value: stats.users },
				{ label: "Attendees", value: stats.attendees },
				{ label: "Professionals", value: stats.mhps },
				{ label: "Sessions", value: stats.sessions },
				{ label: "Mood Logs", value: stats.moodLogs },
		  ]
		: [];

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
			{error && (
				<div className="col-span-full text-sm text-red-600">{error}</div>
			)}
			{items.map((i) => (
				<div
					key={i.label}
					className="p-4 bg-white/80 rounded-xl border shadow-sm">
					<div className="text-xs uppercase tracking-wide text-slate-500 font-medium">
						{i.label}
					</div>
					<div className="text-2xl font-semibold mt-1 text-indigo-600">
						{i.value}
					</div>
				</div>
			))}
		</div>
	);
};
