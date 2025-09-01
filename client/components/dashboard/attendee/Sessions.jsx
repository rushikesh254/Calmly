"use client";
import { useState, useEffect } from "react";
import { SessionCard } from "@/components/dashboard/attendee/SessionCard"; // Importing the session card for displaying sessions

export const Sessions = ({ email }) => {
	const [sessions, setSessions] = useState([]); // Track all sessions including approved ones
	const [filter, setFilter] = useState("all"); // Filter for session statuses
	const [error, setError] = useState("");

	// Fetch sessions (including approved sessions)
	useEffect(() => {
		if (!email) return; // wait until email is available
		const fetchSessions = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(
					`${
						process.env.NEXT_PUBLIC_API_URL
					}/api/sessions/attendee?attendee_email=${encodeURIComponent(email)}`,
					{
						headers: {
							Authorization: token ? `Bearer ${token}` : "",
						},
					}
				);
				if (!response.ok) {
					throw new Error("Failed to fetch sessions");
				}
				const data = await response.json();
				// Sort the sessions from the latest to the past (descending order)
				const sortedSessions = data.sort(
					(a, b) => new Date(b.session_date) - new Date(a.session_date)
				);
				setSessions(sortedSessions);
				setError("");
			} catch (e) {
				setError("Unable to load sessions");
			}
		};
		fetchSessions();
	}, [email]);

	// Filter sessions based on status
	const filteredSessions = sessions.filter(
		(session) => filter === "all" || session.session_status === filter
	);

	return (
		<section id="sessions" className="mb-12">
			<h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-8">
				My Sessions
			</h2>

			{/* Filter buttons */}
			<div className="mb-4 flex gap-2 flex-wrap">
				<button
					onClick={() => setFilter("all")}
					className="bg-blue-600 text-white py-2 px-4 rounded-full mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors">
					All Sessions
				</button>
				<button
					onClick={() => setFilter("pending")}
					className="bg-rose-600 text-white py-2 px-4 rounded-full mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors">
					Pending Sessions
				</button>
				<button
					onClick={() => setFilter("approved")}
					className="bg-emerald-600 text-white py-2 px-4 rounded-full mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors">
					Approved Sessions
				</button>
				<button
					onClick={() => setFilter("completed")}
					className="bg-green-600 px-4 py-2 text-white rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-colors">
					Completed Sessions
				</button>
			</div>

			{/* Display sessions (both pending and approved) */}
			{error ? (
				<p className="text-red-500">{error}</p>
			) : filteredSessions.length === 0 ? (
				<div className="p-6 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
					No sessions at the moment.
				</div>
			) : (
				<div className="space-y-6">
					{filteredSessions.map((session) => (
						<SessionCard
							key={session._id}
							professional={{ name: session.professional_email }}
							datetime={session.session_date}
							sessionStatus={session.session_status}
							recommendations={session.recommendations}
							sessionID={session._id}
							sessionType={session.session_type}
							paymentStatus={session.payment_status}
						/>
					))}
				</div>
			)}
		</section>
	);
};
