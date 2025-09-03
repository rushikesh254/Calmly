import { useState, useEffect } from "react";
import { MHPSessionCard } from "./MHPSessionCard";

export const MHPSessions = ({ email }) => {
	const [sessionRequests, setSessionRequests] = useState([]);
	const [filter, setFilter] = useState("all");
	const [attendeeFilter, setAttendeeFilter] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedSessionId, setSelectedSessionId] = useState(null);
	const [scheduledDate, setScheduledDate] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [notification, setNotification] = useState(null);

	const getToken = () => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem("token") || localStorage.getItem("accessToken");
	};

	useEffect(() => {
		const fetchSessionRequests = async () => {
			const token = getToken();
			if (!token) {
				setNotification("Sign in required to view sessions.");
				return;
			}
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/sessions?professional_email=${email}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const data = await response.json();
			const sortedSessions = data.sort(
				(a, b) => new Date(b.session_date) - new Date(a.session_date)
			);
			setSessionRequests(sortedSessions);
		};
		fetchSessionRequests();
	}, [email]);

	// Pick up attendee filter set by Clients page and then clear it so refreshes don't persist unintentionally
	useEffect(() => {
		if (typeof window === "undefined") return;
		const key = "mhpSessionsFilterAttendeeEmail";
		const value = localStorage.getItem(key);
		if (value) {
			setAttendeeFilter(value);
			localStorage.removeItem(key);
		}
	}, []);

	useEffect(() => {
		if (notification) {
			const timer = setTimeout(() => setNotification(null), 3000);
			return () => clearTimeout(timer);
		}
	}, [notification]);

	const handleApprove = (sessionId) => {
		setSelectedSessionId(sessionId);
		setModalVisible(true);
	};

	const handleDecline = async (sessionId) => {
		const token = getToken();
		if (!token) {
			setNotification("Sign in required.");
			return;
		}
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/approve/${sessionId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ status: "declined" }),
				}
			);

			const data = await response.json();
			if (response.ok) {
				setSessionRequests((prev) =>
					prev.map((session) =>
						session._id === sessionId
							? { ...session, session_status: "declined" }
							: session
					)
				);
				setNotification("Session declined!");
			} else {
				setNotification("Error: " + data.error);
			}
		} catch {
			setNotification("Error declining session");
		}
	};

	const handleSaveDate = async () => {
		if (!scheduledDate) {
			setErrorMessage("Please select a valid date and time.");
			return;
		}

		try {
			const token = getToken();
			if (!token) {
				setNotification("Sign in required.");
				return;
			}
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/approve/${selectedSessionId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						status: "approved",
						scheduled_date: new Date(scheduledDate),
					}),
				}
			);

			const data = await response.json();
			if (response.ok) {
				setSessionRequests((prev) =>
					prev.map((session) =>
						session._id === selectedSessionId
							? {
									...session,
									session_status: "approved",
									session_date: scheduledDate,
								}
							: session
					)
				);
				setNotification("Session approved and scheduled!");
				setModalVisible(false);
				setScheduledDate("");
			} else {
				setNotification("Error: " + data.error);
			}
		} catch {
			setNotification("Error approving session");
		}
	};

	const filteredSessions = sessionRequests.filter((session) => {
		if (attendeeFilter && session.attendee_email !== attendeeFilter) {
			return false;
		}
		if (filter === "all") return true;
		if (filter === "offline") return session.session_type === "offline";
		if (filter === "pending") return session.session_status === "pending";
		if (filter === "approved") return session.session_status === "approved";
		if (filter === "declined") return session.session_status === "declined";
		if (filter === "completed") return session.session_status === "completed";
		return true;
	});

	const handleCompleteSession = async (sessionId) => {
		try {
			const token = getToken();
			if (!token) {
				alert("Sign in required.");
				return;
			}
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/complete/${sessionId}`,
				{
					method: "POST",
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			const data = await response.json();
			if (response.ok) {
				// alert(data.message);
				// Update session status in the UI, e.g., refresh sessions list
			} else {
				alert("Error: " + data.error);
			}
			window.location.reload();
		} catch {
			alert("Error completing session");
		}
	};

	const handleProvideRecommendation = async (sessionId, recommendation) => {
		try {
			const token = getToken();
			if (!token) {
				setNotification("Sign in required.");
				return;
			}
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/recommendations/${sessionId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ recommendations: recommendation }),
				}
			);

			if (response.ok) {
				// Refresh session data instead of showing alert
				const updatedSessions = sessionRequests.map((session) =>
					session._id === sessionId
						? { ...session, recommendations: recommendation }
						: session
				);
				setSessionRequests(updatedSessions);
			}
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
						<button
							className="ml-1 rounded-full px-2 hover:bg-indigo-100 dark:hover:bg-indigo-800"
							onClick={() => setAttendeeFilter("")}
							aria-label="Clear client filter">
							&times;
						</button>
					</span>
				</div>
			)}
			{notification && (
				<div
					className="fixed top-4 right-4 z-50 px-6 py-4 bg-green-500 text-white rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in"
					role="status"
					aria-live="polite">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clipRule="evenodd"
						/>
					</svg>
					<span>{notification}</span>
				</div>
			)}

			<section id="sessions" className="mb-12 min-h-[60vh]">
				<h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-8">
					Session Requests
				</h2>

				<div className="mb-4 flex gap-2 flex-wrap">
					<button
						onClick={() => setFilter("all")}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
							filter === "all"
								? "bg-indigo-600 text-white"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}>
						All Sessions
					</button>
					<button
						onClick={() => setFilter("offline")}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
							filter === "offline"
								? "bg-lime-600 text-white"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}>
						Offline Sessions
					</button>
					<button
						onClick={() => setFilter("pending")}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
							filter === "pending"
								? "bg-orange-600 text-white"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}>
						Requested Sessions
					</button>
					<button
						onClick={() => setFilter("approved")}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
							filter === "approved"
								? "bg-teal-600 text-white"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}>
						Approved Sessions
					</button>
					<button
						onClick={() => setFilter("declined")}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
							filter === "declined"
								? "bg-red-600 text-white"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}>
						Declined Sessions
					</button>
					<button
						onClick={() => setFilter("completed")}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
							filter === "completed"
								? "bg-lime-600 text-white"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}>
						Completed Sessions
					</button>
				</div>

				<div className="space-y-4">
					{filteredSessions.length === 0 ? (
						<div
							className="p-6 text-center text-gray-500"
							role="status"
							aria-live="polite">
							No session requests found
						</div>
					) : (
						filteredSessions.map((session) => (
							<MHPSessionCard
								key={session._id}
								attendee={{ name: session.attendee_email }}
								datetime={session.session_date}
								sessionStatus={session.session_status}
								sessionType={session.session_type}
								sessionID={session._id}
								paymentStatus={session.payment_status}
								recommendations={session.recommendations}
								onApprove={() => handleApprove(session._id)}
								onDecline={() => handleDecline(session._id)}
								onComplete={() => handleCompleteSession(session._id)}
								onProvideRecommendation={handleProvideRecommendation}
							/>
						))
					)}
				</div>
			</section>

			{modalVisible && (
				<div
					className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
					role="dialog"
					aria-modal="true"
					aria-labelledby="schedule-title">
					<div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
						<div className="flex justify-between items-center">
							<h3
								id="schedule-title"
								className="text-xl font-semibold text-gray-800">
								Schedule Session
							</h3>
							<button
								onClick={() => setModalVisible(false)}
								className="text-gray-500 hover:text-gray-700 text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded"
								aria-label="Close">
								&times;
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Select Date & Time
								</label>
								<input
									type="datetime-local"
									value={scheduledDate}
									onChange={(e) => setScheduledDate(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							{errorMessage && (
								<p className="text-red-600 text-sm">{errorMessage}</p>
							)}
						</div>

						<div className="flex justify-end gap-3">
							<button
								onClick={() => setModalVisible(false)}
								className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
								Cancel
							</button>
							<button
								onClick={handleSaveDate}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
								Confirm Schedule
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
