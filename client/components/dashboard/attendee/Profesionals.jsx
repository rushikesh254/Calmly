"use client";
import { useState, useEffect } from "react";
import { ProfessionalCard } from "@/components/dashboard/attendee/ProfessionalCard"; // Importing the ProfessionalCard for displaying each professional

export const Professionals = ({ email }) => {
	const [professionals, setProfessionals] = useState([]);
	const [message, setMessage] = useState(""); // State for success/error message
	const [requestedSessions, setRequestedSessions] = useState({}); // Track session requests

	// Fetch professionals
	useEffect(() => {
		const fetchProfessionals = async () => {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/professionals`,
				{
					headers: {
						Authorization: token ? `Bearer ${token}` : "",
					},
				}
			);
			const data = await response.json();
			setProfessionals(data);
		};
		fetchProfessionals();
	}, []);

	// Request session for a selected professional
	const requestSession = async (professionalEmail, sessionType) => {
		if (!email) return;
		const sessionData = {
			attendee_email: email,
			professional_email: professionalEmail,
			session_type: sessionType,
			session_date: new Date().toISOString(),
		};

		const token = localStorage.getItem("token");
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/request`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token ? `Bearer ${token}` : "",
				},
				body: JSON.stringify(sessionData),
			}
		);

		await response.json();
		if (response.ok) {
			setRequestedSessions((prevState) => ({
				...prevState,
				[professionalEmail]: sessionType,
			}));
			setMessage("Session requested successfully!"); // Success message
		} else {
			setMessage("Failed to request session. Please try again."); // Error message
		}
	};

	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => {
				setMessage("");
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [message]);

	const approvedProfessionals = professionals.filter(
		(p) => p.status === "approved"
	);

	return (
		<div>
			<section id="professionals" className="mb-12">
				<h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-8">
					Available Professionals
				</h2>
				{approvedProfessionals.length === 0 ? (
					<div className="p-6 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
						No approved professionals yet. Please check back later.
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{approvedProfessionals.map((professional) => (
							<ProfessionalCard
								key={professional.email}
								professional={professional}
								onRequestSession={requestSession}
								sessionStatus={requestedSessions[professional.email]}
							/>
						))}
					</div>
				)}
			</section>

			{/*  Display the success/error message */}
			{message && (
				<div
					className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
						message.includes("Failed")
							? "bg-red-200 text-red-700"
							: "bg-green-200 text-green-700"
					}`}
					role="status"
					aria-live="polite">
					{message}
				</div>
			)}
		</div>
	);
};
