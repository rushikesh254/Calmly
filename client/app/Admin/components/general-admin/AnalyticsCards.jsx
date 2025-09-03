"use client";
import { useEffect, useState } from "react";

export const AnalyticsCards = () => {
	const [stats, setStats] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const token = localStorage.getItem("accessToken");
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/admin/manage/stats`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				const data = await res.json();
				if (res.ok) setStats(data.totals);
				else setError(data.error || "Failed");
			} catch {
				setError("Network error");
			}
		};
		fetchStats();
	}, []);

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
