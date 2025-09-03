"use client";
import React, { useEffect, useState } from "react";

// Keep constants at the top for easier maintenance
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const ATTENDEES_ENDPOINT = `${API_BASE}/api/attendees/all`;

export const AttendeeInformation = () => {
	const [attendees, setAttendees] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedAttendee, setSelectedAttendee] = useState(null);

	useEffect(() => {
		const fetchAttendees = async () => {
			try {
				const response = await fetch(ATTENDEES_ENDPOINT);
				if (!response.ok) throw new Error("Failed to fetch attendees");
				const data = await response.json();
				setAttendees(data);
			} catch (err) {
				// Error is handled via UI; avoid console noise
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchAttendees();
	}, []);

	const closeModal = () => setSelectedAttendee(null);

	if (loading) {
		return (
			<div className="min-h-dvh flex items-center justify-center">
				<div className="animate-pulse text-lg text-gray-600 dark:text-gray-300">
					Loading attendees...
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
			{/* Profile Modal */}
			{selectedAttendee && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
					<div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden m-4">
						<div className="p-6 bg-indigo-50 flex justify-between items-center">
							<h3 className="text-2xl font-bold text-indigo-600">
								{selectedAttendee.username}&apos;s Profile
							</h3>
							<button
								onClick={closeModal}
								className="text-gray-500 hover:text-gray-700">
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
								<InfoItem label="Email" value={selectedAttendee.email} />
								<InfoItem label="Phone" value={selectedAttendee.phoneNumber} />
								<InfoItem label="Age" value={selectedAttendee.age} />
								<InfoItem label="Gender" value={selectedAttendee.sex} />
								<InfoItem label="Address" value={selectedAttendee.address} />
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Main Content */}
			<section id="attendees" className="py-12">
				<h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-12 text-center">
					Attendees Information
				</h2>

				{attendees.length === 0 ? (
					<div className="text-center py-12 bg-gray-50 dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-slate-800">
						<p className="text-gray-500 dark:text-gray-400 text-lg">
							No attendees found
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{attendees.map((attendee) => (
							<AttendeeCard
								key={attendee.email}
								attendee={attendee}
								onView={() => setSelectedAttendee(attendee)}
							/>
						))}
					</div>
				)}
			</section>
		</div>
	);
};

// Helper component
const InfoItem = ({ label, value }) => (
	<div className="flex items-center text-sm text-gray-600">
		<span className="font-medium text-gray-500 mr-2">{label}:</span>
		<span className="text-gray-700">{value || "N/A"}</span>
	</div>
);

// Presentational card extracted for clarity; markup and classes remain unchanged
const AttendeeCard = ({ attendee, onView }) => (
	<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-slate-800 overflow-hidden">
		<div className="p-6 pb-4 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900">
			<div className="flex items-start justify-between mb-4">
				<div>
					<h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
						{attendee.username}
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						{attendee.email}
					</p>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-indigo-400 dark:text-indigo-300"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fillRule="evenodd"
						d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
						clipRule="evenodd"
					/>
				</svg>
			</div>
			<div className="space-y-2">
				<InfoItem label="Age" value={attendee.age} />
				<InfoItem label="Gender" value={attendee.sex} />
			</div>
		</div>
		<div className="p-6 pt-4 border-t border-gray-100 dark:border-slate-800">
			<button
				onClick={onView}
				className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 dark:text-indigo-300 transition-all text-sm font-semibold">
				View Full Profile
			</button>
		</div>
	</div>
);
