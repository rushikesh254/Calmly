"use client"; // Attendee sessions list – adds a11y + naming clarity, preserves behavior
import { useState, useEffect, useMemo } from "react";
import { SessionCard } from "@/components/dashboard/attendee/SessionCard";

export const Sessions = ({ email }) => {
	const [allSessions, setAllSessions] = useState([]);
	const [statusFilter, setStatusFilter] = useState("all");
	const [errorMessage, setErrorMessage] = useState("");

	const headingClass =
		"text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-8";
	const filterBtnBase =
		"py-2 px-4 rounded-full mr-2 focus-visible:outline-none focus-visible:ring-2 transition-colors text-white";
	const filterAll = `${filterBtnBase} bg-blue-600 focus-visible:ring-blue-500`;
	const filterPending = `${filterBtnBase} bg-rose-600 focus-visible:ring-rose-500`;
	const filterApproved = `${filterBtnBase} bg-emerald-600 focus-visible:ring-emerald-500`;
	const filterCompleted = `${filterBtnBase} bg-green-600 focus-visible:ring-green-500`;

	useEffect(() => {
		if (!email) return;
		const loadSessions = async () => {
			try {
				const authToken = localStorage.getItem("token");
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/attendee?attendee_email=${encodeURIComponent(email)}`, {
					headers: { Authorization: authToken ? `Bearer ${authToken}` : "" },
				});
				if (!response.ok) throw new Error("Failed to fetch sessions");
				const payload = await response.json();
				const sorted = payload.sort((a, b) => new Date(b.session_date) - new Date(a.session_date));
				setAllSessions(sorted);
				setErrorMessage("");
			} catch (e) {
				setErrorMessage("Unable to load sessions");
			}
		};
		loadSessions();
	}, [email]);

	const visibleSessions = useMemo(() => allSessions.filter(s => statusFilter === "all" || s.session_status === statusFilter), [allSessions, statusFilter]);

	return (
		<section id="sessions" className="mb-12">
			<h2 className={headingClass}>My Sessions</h2>

			<div className="mb-4 flex gap-2 flex-wrap">
				<button onClick={() => setStatusFilter("all")} className={filterAll}>
					All Sessions
				</button>
				<button
					onClick={() => setStatusFilter("pending")}
					className={filterPending}>
					Pending Sessions
				</button>
				<button
					onClick={() => setStatusFilter("approved")}
					className={filterApproved}>
					Approved Sessions
				</button>
				<button
					onClick={() => setStatusFilter("completed")}
					className={filterCompleted}>
					Completed Sessions
				</button>
			</div>

			{errorMessage ? (
				<p className="text-red-500" role="alert" aria-live="polite">{errorMessage}</p>
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
