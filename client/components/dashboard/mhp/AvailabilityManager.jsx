"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AvailabilityManager = () => {
	const [date, setDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [slots, setSlots] = useState([]);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const professionalId =
		typeof window !== "undefined" ? localStorage.getItem("userId") : null;

	const fetchSlots = useCallback(async () => {
		if (!professionalId) return;
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/availability/${professionalId}`
		);
		const data = await res.json();
		setSlots(data);
	}, [professionalId]);

	useEffect(() => {
		fetchSlots();
	}, [professionalId, fetchSlots]);

	const addSlot = async (e) => {
		e.preventDefault();
		if (!date || !startTime || !endTime) return;
		setLoading(true);
		try {
			const token =
				(typeof window !== "undefined" && localStorage.getItem("token")) ||
				(typeof window !== "undefined" && localStorage.getItem("accessToken"));
			if (!token) {
				setMessage("Sign in required.");
				setLoading(false);
				return;
			}
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/availability`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ slots: [{ date, startTime, endTime }] }),
				}
			);
			const data = await res.json();
			if (res.ok) {
				setMessage("Slot added");
				setDate("");
				setStartTime("");
				setEndTime("");
				fetchSlots();
			} else setMessage(data.error || "Error adding slot");
		} catch {
			setMessage("Network error");
		} finally {
			setLoading(false);
			setTimeout(() => setMessage(""), 2500);
		}
	};

	return (
		<Card className="p-6 space-y-6">
			<h2 className="text-xl font-semibold">Manage Availability</h2>
			<form onSubmit={addSlot} className="grid gap-4 md:grid-cols-4 items-end">
				<div className="flex flex-col">
					<label className="text-sm font-medium mb-1">Date</label>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="border rounded px-3 py-2"
						required
					/>
				</div>
				<div className="flex flex-col">
					<label className="text-sm font-medium mb-1">Start</label>
					<input
						type="time"
						value={startTime}
						onChange={(e) => setStartTime(e.target.value)}
						className="border rounded px-3 py-2"
						required
					/>
				</div>
				<div className="flex flex-col">
					<label className="text-sm font-medium mb-1">End</label>
					<input
						type="time"
						value={endTime}
						onChange={(e) => setEndTime(e.target.value)}
						className="border rounded px-3 py-2"
						required
					/>
				</div>
				<Button type="submit" disabled={loading}>
					{loading ? "Adding..." : "Add Slot"}
				</Button>
			</form>
			{message && <div className="text-sm text-indigo-600">{message}</div>}
			<div>
				<h3 className="font-medium mb-2">Upcoming Slots</h3>
				<div className="space-y-2 max-h-64 overflow-y-auto">
					{slots.length === 0 && (
						<div className="text-sm text-slate-500">No slots yet.</div>
					)}
					{slots.map((s) => (
						<div
							key={s._id}
							className="flex justify-between items-center border rounded px-3 py-2 text-sm bg-white/70">
							<span>
								{s.date} {s.startTime}-{s.endTime}
							</span>
							<span
								className={`text-xs px-2 py-1 rounded ${
									s.isBooked
										? "bg-red-100 text-red-700"
										: "bg-green-100 text-green-700"
								}`}>
								{s.isBooked ? "Booked" : "Open"}
							</span>
						</div>
					))}
				</div>
			</div>
		</Card>
	);
};

export default AvailabilityManager;
