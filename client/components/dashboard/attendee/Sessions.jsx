"use client";
import { useState, useEffect } from "react";
import { SessionCard } from "@/components/dashboard/attendee/SessionCard"; // Card component to display a single session

export const Sessions = ({ email }) => {
	// State: all sessions, current status filter, and error message (if any)
	const [allSessions, setAllSessions] = useState([]);
	const [statusFilter, setStatusFilter] = useState("all");
	const [errorMessage, setErrorMessage] = useState("");

	// Fetch sessions (including approved sessions)
	useEffect(() => {
		if (!email) return; // Wait until email is available
		const loadSessions = async () => {
			try {
				const authToken = localStorage.getItem("token");
				const response = await fetch(
					`${
						process.env.NEXT_PUBLIC_API_URL
					}/api/sessions/attendee?attendee_email=${encodeURIComponent(email)}`,
					{
						headers: {
							Authorization: authToken ? `Bearer ${authToken}` : "",
						},
					}
				);
				if (!response.ok) {
					throw new Error("Failed to fetch sessions");
				}
				const payload = await response.json();
				// Sort the sessions from the latest to the past (descending order)
				const sortedSessions = payload.sort(
					(a, b) => new Date(b.session_date) - new Date(a.session_date)
				);
				setAllSessions(sortedSessions);
				setErrorMessage("");
			} catch (e) {
				setErrorMessage("Unable to load sessions");
			}
		};
		loadSessions();
	}, [email]);

	// Filter sessions based on status
	const visibleSessions = allSessions.filter(
		(session) =>
			statusFilter === "all" || session.session_status === statusFilter
	);

	return (
		<section id="sessions" className="mb-12">
			<h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-8">
				My Sessions
			</h2>

			{/* Filter buttons */}
			<div className="mb-4 flex gap-2 flex-wrap">
				<button
					onClick={() => setStatusFilter("all")}
					className="bg-blue-600 text-white py-2 px-4 rounded-full mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors">
					All Sessions
				</button>
				<button
					onClick={() => setStatusFilter("pending")}
					className="bg-rose-600 text-white py-2 px-4 rounded-full mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors">
					Pending Sessions
				</button>
				<button
					onClick={() => setStatusFilter("approved")}
					className="bg-emerald-600 text-white py-2 px-4 rounded-full mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors">
					Approved Sessions
				</button>
				<button
					onClick={() => setStatusFilter("completed")}
					className="bg-green-600 px-4 py-2 text-white rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-colors">
					Completed Sessions
				</button>
			</div>

			{/* Display sessions (both pending and approved) */}
			{errorMessage ? (
				<p className="text-red-500">{errorMessage}</p>
			) : visibleSessions.length === 0 ? (
				<div className="p-6 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
					No sessions at the moment.
				</div>
			) : (
				<div className="space-y-6">
					{visibleSessions.map((session) => (
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
