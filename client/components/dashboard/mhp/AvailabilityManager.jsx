"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * AvailabilityManager
 * --------------------
 * Allows an MHP to publish availability slots. Keeps the UI purposely simple:
 * a small form + a scrolling list of existing slots. Functionality and styling
 * are preserved while providing clearer naming, accessibility hooks, and
 * guarded fetch logic. No API contract changes.
 */
const AvailabilityManager = () => {
	// Local helpers kept inside component (no external dependency / SSR safety)
	const getAuthToken = useCallback(
		() => (typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null),
		[]
	);
	const professionalId = useMemo(
		() => (typeof window !== "undefined" ? localStorage.getItem("userId") : null),
		[]
	);

	// Form state
	const [date, setDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");

	// Data + UI state
	const [slots, setSlots] = useState([]);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	// Static classes (centralised for quick visual tweaking)
	const inputClass = "border rounded px-3 py-2";
	const headingClass = "text-xl font-semibold";
	const slotRowClass = "flex justify-between items-center border rounded px-3 py-2 text-sm bg-white/70";
	const badgeOpenClass = "text-xs px-2 py-1 rounded bg-green-100 text-green-700";
	const badgeBookedClass = "text-xs px-2 py-1 rounded bg-red-100 text-red-700";

	// Load existing slots
	const loadSlots = useCallback(async () => {
		if (!professionalId) return;
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability/${professionalId}`);
			const data = await res.json();
			setSlots(Array.isArray(data) ? data : []);
		} catch {
			// Silent failure – non‑critical (UI just shows empty list)
		}
	}, [professionalId]);

	useEffect(() => {
		loadSlots();
	}, [loadSlots]);

	// Add a new slot
	const handleAddSlot = async (e) => {
		e.preventDefault();
		if (!date || !startTime || !endTime) return;
		setLoading(true);
		try {
			const token = getAuthToken();
			if (!token) {
				setMessage("Sign in required.");
				return;
			}
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ slots: [{ date, startTime, endTime }] }),
			});
			const data = await res.json();
			if (res.ok) {
				setMessage("Slot added");
				setDate("");
				setStartTime("");
				setEndTime("");
				loadSlots();
			} else {
				setMessage(data?.error || "Error adding slot");
			}
		} catch {
			setMessage("Network error");
		} finally {
			setLoading(false);
			// Ephemeral feedback
			setTimeout(() => setMessage(""), 2500);
		}
	};

	return (
		<Card className="p-6 space-y-6" aria-labelledby="availability-heading">
			<h2 id="availability-heading" className={headingClass}>Manage Availability</h2>
			<form onSubmit={handleAddSlot} className="grid gap-4 md:grid-cols-4 items-end" aria-describedby={message ? "availability-message" : undefined}>
				<div className="flex flex-col">
					<label className="text-sm font-medium mb-1" htmlFor="slot-date">Date</label>
					<input id="slot-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
				</div>
				<div className="flex flex-col">
					<label className="text-sm font-medium mb-1" htmlFor="slot-start">Start</label>
					<input id="slot-start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} required />
				</div>
				<div className="flex flex-col">
					<label className="text-sm font-medium mb-1" htmlFor="slot-end">End</label>
					<input id="slot-end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} required />
				</div>
				<Button type="submit" disabled={loading} aria-busy={loading} aria-live="polite">{loading ? "Adding..." : "Add Slot"}</Button>
			</form>
			{message && (
				<div id="availability-message" className="text-sm text-indigo-600" role="status" aria-live="polite">{message}</div>
			)}
			<div>
				<h3 className="font-medium mb-2" id="upcoming-slots-heading">Upcoming Slots</h3>
				<ul className="space-y-2 max-h-64 overflow-y-auto" aria-labelledby="upcoming-slots-heading">
					{slots.length === 0 && (
						<li className="text-sm text-slate-500" role="status" aria-live="polite">No slots yet.</li>
					)}
					{slots.map((slot) => (
						<li key={slot._id} className={slotRowClass}>
							<span>{slot.date} {slot.startTime}-{slot.endTime}</span>
							<span className={slot.isBooked ? badgeBookedClass : badgeOpenClass}>{slot.isBooked ? "Booked" : "Open"}</span>
						</li>
					))}
				</ul>
			</div>
		</Card>
	);
};

export default AvailabilityManager;
