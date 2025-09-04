// "use client";
// import React, { useEffect, useState } from "react";

// export const SessionsInformation = () => {
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         // Adjust the endpoint if needed (this example assumes /api/session returns the sessions)
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/all`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch sessions");
//         }
//         const data = await response.json();
//         setSessions(data);
//       } catch (err) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSessions();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading sessions...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <section id="sessions" className="mb-12">
//         <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-8">
//           Sessions Information
//         </h2>
//         {sessions.length === 0 ? (
//           <p>No sessions found.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {sessions.map((session) => (
//               <div key={session._id} className="border p-4 rounded-lg shadow">
//                 <p><strong>Attendee:</strong> {session.attendee_email}</p>
//                 <p><strong>Professional:</strong> {session.professional_email}</p>
//                 <p><strong>Type:</strong> {session.session_type}</p>
//                 <p><strong>Status:</strong> {session.session_status}</p>
//                 <p>
//                   <strong>Date:</strong>{" "}
//                   {new Date(session.session_date).toLocaleString()}
//                 </p>
//                 {session.recommendations && (
//                   <p><strong>Recommendations:</strong> {session.recommendations}</p>
//                 )}
//                 <p><strong>Payment:</strong> {session.payment_status}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };
"use client";
import React, { useEffect, useState } from "react";

// Constants and tiny helpers
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const SESSIONS_ENDPOINT = `${API_BASE}/api/sessions/all`;
const getToken = () =>
	(typeof window !== "undefined" &&
		(localStorage.getItem("accessToken") || localStorage.getItem("token"))) ||
	null;
const withAuth = (token) => (token ? { Authorization: `Bearer ${token}` } : {});
const statusBadgeClass = (status) =>
	`px-3 py-1 rounded-full text-xs font-medium ${
		status === "completed"
			? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
			: status === "pending"
			? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
			: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
	}`;

export const SessionsInformation = () => {
	const [sessions, setSessions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedSession, setSelectedSession] = useState(null);

	useEffect(() => {
		const fetchSessions = async () => {
			try {
				// Admin route is protected: requires Authorization with an admin JWT
				const token = getToken();
				if (!token) {
					throw new Error("Not authenticated. Please sign in as admin.");
				}
				const response = await fetch(SESSIONS_ENDPOINT, {
					headers: withAuth(token),
				});
				if (!response.ok) throw new Error("Failed to fetch sessions");
				const data = await response.json();
				setSessions(data);
			} catch (err) {
				// Error handled via UI
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchSessions();
	}, []);

	const closeModal = () => setSelectedSession(null);

	if (loading) {
		return (
			<div className="min-h-dvh flex items-center justify-center">
				<div className="animate-pulse text-lg text-gray-600 dark:text-gray-300">
					Loading sessions...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-dvh flex items-center justify-center">
				<div className="text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-950/40 p-4 rounded-xl border border-red-100 dark:border-red-900/40">
					Error: {error}
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			{/* Session Details Modal */}
			{selectedSession && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
					<div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden m-4 border border-slate-200/60 dark:border-slate-800">
						<div className="p-6 bg-indigo-50 dark:bg-slate-800 flex justify-between items-center">
							<h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
								Session Details
							</h3>
							<button
								onClick={closeModal}
								className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
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

						<div className="p-6 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<InfoItem
									label="Session Type"
									value={selectedSession.session_type}
								/>
								<InfoItem
									label="Session Status"
									value={selectedSession.session_status}
								/>
								<InfoItem
									label="Attendee Email"
									value={selectedSession.attendee_email}
								/>
								<InfoItem
									label="Professional Email"
									value={selectedSession.professional_email}
								/>
								<InfoItem
									label="Date"
									value={new Date(
										selectedSession.session_date
									).toLocaleString()}
								/>
								<InfoItem
									label="Payment Status"
									value={selectedSession.payment_status}
								/>
							</div>

							{selectedSession.recommendations && (
								<div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
									<div className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
										<svg
											className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
										Recommendations
									</div>
									<p className="text-gray-700 dark:text-gray-300">
										{selectedSession.recommendations}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Main Content */}
			<section id="sessions" className="py-12">
				<h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-12 text-center">
					Sessions
				</h2>

				{sessions.length === 0 ? (
					<div className="text-center py-12 bg-gray-50 dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-slate-800">
						<p className="text-gray-500 dark:text-gray-400 text-lg">
							No sessions found
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{sessions.map((session) => (
							<div
								key={session._id}
								className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-slate-800 overflow-hidden">
								<div className="p-6 pb-4 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900">
									<div className="flex items-start justify-between mb-4">
										<div>
											<h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 capitalize">
												{session.session_type}
											</h3>
											<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
												{new Date(session.session_date).toLocaleDateString()}
											</p>
										</div>
										<span className={statusBadgeClass(session.session_status)}>
											{session.session_status}
										</span>
									</div>

									<div className="space-y-2">
										<InfoItem label="Attendee" value={session.attendee_email} />
										<InfoItem
											label="Professional"
											value={session.professional_email}
										/>
										<InfoItem label="Payment" value={session.payment_status} />
									</div>
								</div>

								<div className="p-6 pt-4 border-t border-gray-100 dark:border-slate-800">
									<button
										onClick={() => setSelectedSession(session)}
										className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 dark:text-indigo-300 transition-all text-sm font-semibold">
										View Session Details
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
};

// Helper component
const InfoItem = ({ label, value }) => (
	<div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
		<span className="font-medium text-gray-500 dark:text-gray-400 mr-2">
			{label}:
		</span>
		<span className="text-gray-700 dark:text-gray-200 truncate">
			{value || "N/A"}
		</span>
	</div>
);
