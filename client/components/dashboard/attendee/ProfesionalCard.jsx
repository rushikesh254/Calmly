import { useState, useEffect } from "react";

export const ProfessionalCard = ({
	professional,
	onRequestSession,
	sessionStatus,
}) => {
	const [requestedSessionType, setRequestedSessionType] = useState(null);
	const [availability, setAvailability] = useState([]);
	const [bookingMsg, setBookingMsg] = useState("");
	const userToken =
		typeof window !== "undefined"
			? localStorage.getItem("token") || localStorage.getItem("accessToken")
			: null;

	// Initialize from sessionStatus on mount
	useEffect(() => {
		if (sessionStatus?.status === "pending") {
			setRequestedSessionType(sessionStatus.type);
		}
	}, [sessionStatus]);

	// Fetch availability for professional
	useEffect(() => {
		const fetchAvail = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/availability/${professional._id}`
				);
				const data = await res.json();
				if (Array.isArray(data)) setAvailability(data);
			} catch {}
		};
		if (professional?._id) fetchAvail();
	}, [professional]);

	const bookSlot = async (slotId) => {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/book/${slotId}`,
				{
					method: "POST",
					headers: { Authorization: `Bearer ${userToken}` },
				}
			);
			const data = await res.json();
			if (res.ok) {
				setAvailability((prev) =>
					prev.map((s) => (s._id === slotId ? { ...s, isBooked: true } : s))
				);
				setBookingMsg("Slot booked successfully");
			} else setBookingMsg(data.error || "Booking failed");
		} catch {
			setBookingMsg("Network error");
		} finally {
			setTimeout(() => setBookingMsg(""), 2500);
		}
	};

	const handleRequestSession = (sessionType) => {
		if (!requestedSessionType) {
			setRequestedSessionType(sessionType);
			onRequestSession(professional.email, sessionType);
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-200 hover:shadow-xl border border-gray-100">
			<div className="flex items-start justify-between mb-4">
				<div>
					<h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
						{professional.username}
					</h3>
					{professional.education && (
						<p className="text-sm text-gray-600 mt-1">
							{professional.education}
						</p>
					)}
					{professional.location && (
						<p className="text-sm text-gray-500 flex items-center mt-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 mr-1"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fillRule="evenodd"
									d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
									clipRule="evenodd"
								/>
							</svg>
							{professional.location}
						</p>
					)}
				</div>
				<p className="text-sm text-gray-400">{professional.email}</p>
			</div>

			<div className="space-y-4">
				<div className="bg-gray-50 p-4 rounded-lg">
					<div className="flex items-center text-sm font-semibold text-gray-700 mb-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2 text-purple-600"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
						</svg>
						Online Availability
					</div>
					{Object.entries(professional.rosterOnline || {}).length > 0 ? (
						<div className="grid grid-cols-2 gap-2">
							{Object.entries(professional.rosterOnline).map(([day, time]) => (
								<div
									key={day}
									className="bg-white p-2 rounded-md text-sm text-center border">
									<span className="font-medium text-gray-600">{day}</span>
									<span className="block text-gray-500">{time}</span>
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-400 text-center py-2">
							No online availability
						</p>
					)}
				</div>

				<div className="bg-gray-50 p-4 rounded-lg">
					<div className="flex items-center text-sm font-semibold text-gray-700 mb-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2 text-blue-600"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
						</svg>
						Offline Availability
					</div>
					{Object.entries(professional.rosterOffline || {}).length > 0 ? (
						<div className="grid grid-cols-2 gap-2">
							{Object.entries(professional.rosterOffline).map(([day, time]) => (
								<div
									key={day}
									className="bg-white p-2 rounded-md text-sm text-center border">
									<span className="font-medium text-gray-600">{day}</span>
									<span className="block text-gray-500">{time}</span>
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-400 text-center py-2">
							No offline availability
						</p>
					)}
				</div>
			</div>

			<div className="mt-4">
				{requestedSessionType ? (
					<div
						className={`p-3 rounded-lg text-center ${
							requestedSessionType === "online"
								? "bg-teal-50 text-teal-700 border border-teal-100"
								: "bg-indigo-50 text-indigo-700 border border-indigo-100"
						}`}>
						<span className="font-medium font-semibold">
							{requestedSessionType.charAt(0).toUpperCase() +
								requestedSessionType.slice(1)}{" "}
							session requested
						</span>
						<p className="text-sm mt-1">
							Waiting for professional&apos;s confirmation
						</p>
					</div>
				) : (
					<div className="flex gap-3">
						<button
							onClick={() => handleRequestSession("online")}
							className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-all text-sm font-medium font-semibold">
							Request Online Session
						</button>
						<button
							onClick={() => handleRequestSession("offline")}
							className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all text-sm font-medium font-semibold">
							Request Offline Session
						</button>
					</div>
				)}
			</div>

			{/* Availability slots */}
			{availability.length > 0 && (
				<div className="mt-6">
					<h4 className="text-sm font-semibold text-gray-700 mb-2">
						Available Slots
					</h4>
					<div className="space-y-2 max-h-56 overflow-y-auto pr-1">
						{availability.map((slot) => (
							<div
								key={slot._id}
								className="flex items-center justify-between text-xs border rounded px-2 py-2 bg-gray-50">
								<span>
									{slot.date} {slot.startTime}-{slot.endTime}
								</span>
								{slot.isBooked ? (
									<span className="text-red-500 font-medium">Booked</span>
								) : (
									<button
										onClick={() => bookSlot(slot._id)}
										className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded">
										Book
									</button>
								)}
							</div>
						))}
					</div>
					{bookingMsg && (
						<div className="text-xs mt-2 text-indigo-600">{bookingMsg}</div>
					)}
				</div>
			)}
		</div>
	);
};
