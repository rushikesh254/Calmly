import { useState, useEffect, useCallback, useMemo } from "react";
import { MHPSessionCard } from "./MHPSessionCard";

/**
 * MHPSessions
 * -----------
 * Session management for an MHP: filterable list + approve / decline / complete actions
 * and recommendation submission. Rewritten for clarity & accessibility; behaviour retained.
 */
export const MHPSessions = ({ email }) => {
	const [sessions, setSessions] = useState([]); // raw list
	const [statusFilter, setStatusFilter] = useState("all");
	const [attendeeFilter, setAttendeeFilter] = useState("");
	const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
	const [activeSessionId, setActiveSessionId] = useState(null);
	const [scheduledDate, setScheduledDate] = useState("");
	const [scheduleError, setScheduleError] = useState("");
	const [notification, setNotification] = useState(null);

	// Token helper
	const getToken = useCallback(
		() => (typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null),
		[]
	);

	// Initial fetch
	useEffect(() => {
		(async () => {
			const token = getToken();
			if (!token) {
				setNotification("Sign in required to view sessions.");
				return;
			}
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions?professional_email=${email}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const data = await res.json();
				const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.session_date) - new Date(a.session_date)) : [];
				setSessions(sorted);
			} catch {
				setNotification("Failed to load sessions");
			}
		})();
	}, [email, getToken]);

	// Pick up cross-component filter (from Clients)
	useEffect(() => {
		if (typeof window === "undefined") return;
		const key = "mhpSessionsFilterAttendeeEmail";
		const value = localStorage.getItem(key);
		if (value) {
			setAttendeeFilter(value);
			localStorage.removeItem(key);
		}
	}, []);

	// Auto-dismiss notification
	useEffect(() => {
		if (!notification) return;
		const timer = setTimeout(() => setNotification(null), 3000);
		return () => clearTimeout(timer);
	}, [notification]);

	// Derived filtered sessions
	const filteredSessions = useMemo(() => {
		return sessions.filter((s) => {
			if (attendeeFilter && s.attendee_email !== attendeeFilter) return false;
			if (statusFilter === "all") return true;
			if (statusFilter === "offline") return s.session_type === "offline";
			return s.session_status === statusFilter; // pending / approved / declined / completed
		});
	}, [sessions, statusFilter, attendeeFilter]);

	// Actions
	const openSchedule = (sessionId) => {
		setActiveSessionId(sessionId);
		setScheduleModalOpen(true);
		setScheduleError("");
	};
	const closeSchedule = () => {
		setScheduleModalOpen(false);
		setActiveSessionId(null);
		setScheduledDate("");
		setScheduleError("");
	};

	const declineSession = async (sessionId) => {
		const token = getToken();
		if (!token) return setNotification("Sign in required.");
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/approve/${sessionId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ status: "declined" }),
			});
			const data = await res.json();
			if (!res.ok) return setNotification("Error: " + (data?.error || "Failed"));
			setSessions((prev) => prev.map((s) => (s._id === sessionId ? { ...s, session_status: "declined" } : s)));
			setNotification("Session declined");
		} catch {
			setNotification("Error declining session");
		}
	};

	const approveSession = async () => {
		if (!scheduledDate) return setScheduleError("Please select a valid date and time.");
		const token = getToken();
		if (!token) return setNotification("Sign in required.");
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/approve/${activeSessionId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ status: "approved", scheduled_date: new Date(scheduledDate) }),
			});
			const data = await res.json();
			if (!res.ok) return setNotification("Error: " + (data?.error || "Failed"));
			setSessions((prev) => prev.map((s) => (s._id === activeSessionId ? { ...s, session_status: "approved", session_date: scheduledDate } : s)));
			setNotification("Session approved and scheduled");
			closeSchedule();
		} catch {
			setNotification("Error approving session");
		}
	};

	const completeSession = async (sessionId) => {
		const token = getToken();
		if (!token) return setNotification("Sign in required.");
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/complete/${sessionId}`, {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (!res.ok) return setNotification("Error: " + (data?.error || "Failed"));
			// Shallow reload approach: update status locally
			setSessions((prev) => prev.map((s) => (s._id === sessionId ? { ...s, session_status: "completed" } : s)));
			setNotification("Session marked completed");
		} catch {
			setNotification("Error completing session");
		}
	};

	const provideRecommendation = async (sessionId, recommendation) => {
		const token = getToken();
		if (!token) return setNotification("Sign in required.");
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/recommendations/${sessionId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ recommendations: recommendation }),
			});
			if (!res.ok) return; // silent fail
			setSessions((prev) => prev.map((s) => (s._id === sessionId ? { ...s, recommendations: recommendation } : s)));
		} catch {
			setNotification("Error providing recommendation");
		}
	};

	return (
		<div>
			{attendeeFilter && (
				<div className="mb-4 flex items-center gap-2">
					<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-700/60">
						Filtering by client: {attendeeFilter}
						<button className="ml-1 rounded-full px-2 hover:bg-indigo-100 dark:hover:bg-indigo-800" onClick={() => setAttendeeFilter("")} aria-label="Clear client filter">&times;</button>
					</span>
				</div>
			)}
			{notification && (
				<div className="fixed top-4 right-4 z-50 px-6 py-4 bg-green-500 text-white rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in" role="status" aria-live="polite">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
					</svg>
					<span>{notification}</span>
				</div>
			)}
			<section id="sessions" className="mb-12 min-h-[60vh]" aria-labelledby="sessions-heading">
				<h2 id="sessions-heading" className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-8">Session Requests</h2>
				<div className="mb-4 flex gap-2 flex-wrap" role="group" aria-label="Session filters">
					{[
						{ key: "all", label: "All Sessions", cls: "bg-indigo-600" },
						{ key: "offline", label: "Offline Sessions", cls: "bg-lime-600" },
						{ key: "pending", label: "Requested Sessions", cls: "bg-orange-600" },
						{ key: "approved", label: "Approved Sessions", cls: "bg-teal-600" },
						{ key: "declined", label: "Declined Sessions", cls: "bg-red-600" },
						{ key: "completed", label: "Completed Sessions", cls: "bg-lime-600" },
					].map((f) => (
						<button key={f.key} onClick={() => setStatusFilter(f.key)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === f.key ? `${f.cls} text-white` : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{f.label}</button>
					))}
				</div>
				<div className="space-y-4" aria-live="polite">
					{filteredSessions.length === 0 ? (
						<div className="p-6 text-center text-gray-500" role="status">No session requests found</div>
					) : (
						filteredSessions.map((s) => (
							<MHPSessionCard key={s._id} attendee={{ name: s.attendee_email }} datetime={s.session_date} sessionStatus={s.session_status} sessionType={s.session_type} sessionID={s._id} paymentStatus={s.payment_status} recommendations={s.recommendations} onApprove={() => openSchedule(s._id)} onDecline={() => declineSession(s._id)} onComplete={() => completeSession(s._id)} onProvideRecommendation={provideRecommendation} />
						))
					)}
				</div>
			</section>
			{scheduleModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="schedule-title">
					<div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
						<div className="flex justify-between items-center">
							<h3 id="schedule-title" className="text-xl font-semibold text-gray-800">Schedule Session</h3>
							<button onClick={closeSchedule} className="text-gray-500 hover:text-gray-700 text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded" aria-label="Close">&times;</button>
						</div>
						<div className="space-y-4">
							<div>
								<label htmlFor="schedule-datetime" className="block text-sm font-medium text-gray-700 mb-2">Select Date & Time</label>
								<input id="schedule-datetime" type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
							</div>
							{scheduleError && <p className="text-red-600 text-sm" role="alert">{scheduleError}</p>}
						</div>
						<div className="flex justify-end gap-3">
							<button onClick={closeSchedule} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
							<button onClick={approveSession} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">Confirm Schedule</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
