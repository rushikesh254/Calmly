import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Calendar, Plus, BarChart3, RefreshCw } from "lucide-react";
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from "recharts";

const MoodLog = () => {
	const [mood, setMood] = useState(5); // slider value 1–10
	const [note, setNote] = useState("");
	const [moodHistory, setMoodHistory] = useState([]);
	const [moodStats, setMoodStats] = useState(null);
	const [loading, setLoading] = useState(false); // history loading
	const [submitting, setSubmitting] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [authMissing, setAuthMissing] = useState(false);
	const [error, setError] = useState(""); // generic fetch/save errors

	const getToken = () => {
		if (typeof window === "undefined") return null;
		const t =
			localStorage.getItem("token") || localStorage.getItem("accessToken");
		if (!t) setAuthMissing(true);
		return t;
	};

	const moodConfig = {
		1: { emoji: "😢", color: "bg-red-500", label: "Very Low" },
		2: { emoji: "😞", color: "bg-red-400", label: "Low" },
		3: { emoji: "😔", color: "bg-orange-500", label: "Somewhat Low" },
		4: { emoji: "😐", color: "bg-orange-400", label: "Below Average" },
		5: { emoji: "😐", color: "bg-yellow-500", label: "Neutral" },
		6: { emoji: "🙂", color: "bg-yellow-400", label: "Above Average" },
		7: { emoji: "😊", color: "bg-green-400", label: "Good" },
		8: { emoji: "😄", color: "bg-green-500", label: "Very Good" },
		9: { emoji: "😁", color: "bg-blue-400", label: "Excellent" },
		10: { emoji: "🤩", color: "bg-purple-500", label: "Perfect" },
	};

	useEffect(() => {
		fetchMoodHistory();
		fetchMoodStats();
	}, []); // initial hydration

	const fetchMoodHistory = async () => {
		try {
			setLoading(true);
			const token = getToken();
			if (!token) return;
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/mood/history?limit=10`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setMoodHistory(data.data.moodLogs);
			} else {
				const err = await response.json().catch(() => ({}));
				setError(err.error || err.message || "Failed to load mood history");
			}
		} catch (e) {
			setError(e.message || "Failed to load mood history");
		} finally {
			setLoading(false);
		}
	};

	const fetchMoodStats = async () => {
		try {
			const token = getToken();
			if (!token) return;
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/mood/stats`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setMoodStats(data.data);
			} else {
				const err = await response.json().catch(() => ({}));
				setError(err.error || err.message || "Failed to load mood stats");
			}
		} catch (e) {
			setError(e.message || "Failed to load mood stats");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!mood) return;

		try {
			setSubmitting(true);
			const token = getToken();
			if (!token) return;
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/mood`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ mood, note }),
				}
			);

			if (response.ok) {
				setMood(5);
				setNote("");
				setShowForm(false);
				fetchMoodHistory();
				fetchMoodStats();
			} else {
				const err = await response.json().catch(() => ({}));
				setError(err.error || err.message || "Failed to save mood log");
			}
		} catch (e) {
			setError(e.message || "Failed to save mood log");
		} finally {
			setSubmitting(false);
		}
	};

	const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

	return (
		<div className="space-y-6">
			{authMissing && (
				<Card className="p-6 bg-amber-50 border-amber-200">
					<div className="flex items-start gap-3">
						<div className="text-amber-600 font-semibold">Sign in required</div>
					</div>
					<p className="text-amber-700 mt-2">
						Please sign in to track your mood. Your session token wasn’t found.
					</p>
					<div className="mt-4">
						<Button onClick={() => (window.location.href = "/signin")}>
							Go to Sign In
						</Button>
					</div>
				</Card>
			)}

			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
						<Smile className="w-6 h-6 text-indigo-600" />
						Mood Tracker
					</h2>
					<p className="text-gray-600 mt-1">
						Track your daily mood and emotional well-being
					</p>
				</div>
				<Button
					onClick={() => setShowForm(!showForm)}
					disabled={authMissing}
					className="bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 disabled:opacity-60 disabled:cursor-not-allowed">
					<Plus className="w-4 h-4 mr-2" />
					Log Mood
				</Button>
			</div>

			{showForm && !authMissing && (
				<Card className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<Label className="text-gray-700 mb-3 block">
								How are you feeling today? (1-10)
							</Label>
							<div className="flex items-center gap-4">
								<div className="flex-1">
									<input type="range" min="1" max="10" value={mood} onChange={(e) => setMood(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" aria-valuemin={1} aria-valuemax={10} aria-valuenow={mood} aria-label="Mood level" />
								</div>
								<div className="flex items-center gap-2">
									<span className="text-2xl">{moodConfig[mood]?.emoji}</span>
									<span className="text-sm font-medium text-gray-600">
										{mood} - {moodConfig[mood]?.label}
									</span>
								</div>
							</div>
						</div>

						<div>
							<Label htmlFor="note" className="text-gray-700">
								Notes (optional)
							</Label>
							<Textarea
								id="note"
								value={note}
								onChange={(e) => setNote(e.target.value)}
								placeholder="How was your day? Any specific events that affected your mood?"
								className="mt-2 bg-white/50 focus:bg-white/70 border-slate-200/60 focus:ring-2 focus:ring-indigo-500/50"
								rows={3}
								maxLength={500}
							/>
							<p className="text-xs text-gray-500 mt-1">
								{note.length}/500 characters
							</p>
						</div>

						<div className="flex gap-3">
							<Button
								type="submit"
								disabled={submitting}
								className="bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600">
								{submitting ? (
									<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
								) : (
									<Plus className="w-4 h-4 mr-2" />
								)}
								{submitting ? "Saving..." : "Save Mood Log"}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowForm(false)}>
								Cancel
							</Button>
						</div>
					</form>
				</Card>
			)}

			{/* Mood Statistics & Trend Chart */}
			{moodStats && !authMissing && (
				<Card className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
					<div className="flex items-center gap-2 mb-6">
						<BarChart3 className="w-5 h-5 text-indigo-600" />
						<h3 className="text-lg font-semibold text-gray-800">
							Mood Insights (Last 30 Days)
						</h3>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div className="lg:col-span-1 space-y-4">
							<div className="text-center p-4 bg-indigo-50 rounded-lg">
								<div className="text-2xl font-bold text-indigo-600">
									{moodStats.averageMood}
								</div>
								<div className="text-sm text-gray-600">Average Mood</div>
							</div>
							<div className="text-center p-4 bg-teal-50 rounded-lg">
								<div className="text-2xl font-bold text-teal-600">
									{moodStats.totalEntries}
								</div>
								<div className="text-sm text-gray-600">Total Entries</div>
							</div>
							<div className="text-center p-4 bg-purple-50 rounded-lg">
								<div className="text-2xl font-bold text-purple-600">
									{moodStats.mostCommonMood}
								</div>
								<div className="text-sm text-gray-600">Most Common</div>
							</div>
						</div>
						<div className="lg:col-span-2 h-64">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart
									data={[...moodHistory].reverse()}
									margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
									<XAxis
										dataKey={(d) =>
											new Date(d.date).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
											})
										}
										tick={{ fontSize: 12 }}
									/>
									<YAxis domain={[1, 10]} tick={{ fontSize: 12 }} />
									<Tooltip
										formatter={(value) => [`Mood: ${value}`, ""]}
										labelFormatter={(label, payload) =>
											payload && payload[0]
												? new Date(payload[0].payload.date).toLocaleString()
												: ""
										}
									/>
									<Line
										type="monotone"
										dataKey="mood"
										stroke="#6366f1"
										strokeWidth={2}
										dot={{ r: 4 }}
										activeDot={{ r: 6 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>
				</Card>
			)}

			{/* Mood History */}
			<Card className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<Calendar className="w-5 h-5 text-indigo-600" />
						<h3 className="text-lg font-semibold text-gray-800">
							Recent Mood History
						</h3>
					</div>
					<Button
						onClick={fetchMoodHistory}
						disabled={loading}
						variant="outline"
						size="sm">
						<RefreshCw
							className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
						/>
						Refresh
					</Button>
				</div>

				{loading ? (
					<div className="text-center py-8">
						<RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
						<p className="text-gray-500 mt-2">Loading mood history...</p>
					</div>
				) : authMissing ? (
					<div className="text-center py-8 text-gray-600">
						Sign in to view your recent mood history.
					</div>
				) : moodHistory.length > 0 ? (
					<div className="space-y-3">
						{moodHistory.map((log) => (
							<div
								key={log._id}
								className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
								<div className="flex items-center gap-4">
									<div className="text-2xl">{moodConfig[log.mood]?.emoji}</div>
									<div>
										<div className="font-medium text-gray-800">
											Mood: {log.mood} - {moodConfig[log.mood]?.label}
										</div>
										{log.note && (
											<div className="text-sm text-gray-600 mt-1">
												{log.note}
											</div>
										)}
									</div>
								</div>
								<div className="text-sm text-gray-500">
									{formatDate(log.date)}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-8">
						<Smile className="w-12 h-12 mx-auto text-gray-400 mb-2" />
						<p className="text-gray-500">
							No mood logs yet. Start tracking your mood!
						</p>
					</div>
				)}
			</Card>

			{error && !authMissing && (
				<div className="text-sm text-red-600" role="alert" aria-live="polite">{error}</div>
			)}
		</div>
	);
};

export default MoodLog;
