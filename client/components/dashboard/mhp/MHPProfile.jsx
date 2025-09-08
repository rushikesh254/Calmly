"use client";
import React, { useState, useEffect, useCallback } from "react";

const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

// API helpers kept local for clarity / testability
const fetchProfileData = async (userName) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mhps/${userName}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	if (!res.ok) throw new Error("Error fetching profile data");
	return res.json();
};
const updateProfileData = async (userName, profileData) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mhps/${userName}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(profileData),
	});
	if (!res.ok) throw new Error("Failed to update profile");
	return res.json();
};

const MHPProfile = ({ userName }) => {
	// Editing & data state
	const [isEditing, setIsEditing] = useState(false);
	const [profileData, setProfileData] = useState({
		username: "",
		licenseNumber: "",
		email: "",
		mobileNumber: "",
		location: "",
		education: "",
		rosterOnline: {},
		rosterOffline: {},
	});
	const [error, setError] = useState(null);
	const [saving, setSaving] = useState(false);

	// Load profile
	useEffect(() => {
		if (!userName) return;
		let cancelled = false;
		(async () => {
			try {
				const data = await fetchProfileData(userName);
				if (cancelled) return;
				setProfileData({
					...data,
					licenseNumber: data.licenseNumber || data.bmdcRegNo,
					rosterOnline: data.rosterOnline || {},
					rosterOffline: data.rosterOffline || {},
				});
			} catch {
				if (!cancelled) setError("Error loading profile data");
			}
		})();
		return () => { cancelled = true; };
	}, [userName]);

	// Generic field change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setProfileData((prev) => ({ ...prev, [name]: value }));
	};

	// Toggle a day within a roster map
	const handleDayToggle = useCallback((rosterType, day, isChecked) => {
		setProfileData((prev) => {
			const roster = { ...prev[rosterType] };
			if (isChecked) roster[day] = roster[day] || ""; else delete roster[day];
			return { ...prev, [rosterType]: roster };
		});
	}, []);

	// Update the time window for a day
	const handleTimeChange = (rosterType, day, value) => {
		setProfileData((prev) => ({ ...prev, [rosterType]: { ...prev[rosterType], [day]: value } }));
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			const updated = await updateProfileData(userName, profileData);
			setProfileData({
				...updated.mhp,
				rosterOnline: updated.mhp.rosterOnline || {},
				rosterOffline: updated.mhp.rosterOffline || {},
			});
			setIsEditing(false);
		} catch {
			setError("Error saving profile data");
		} finally {
			setSaving(false);
		}
	};

	if (error) return <div className="text-red-600" role="alert">{error}</div>;

	// Helper components
	const ProfileRow = ({ label, value }) => (
		<div className="flex justify-between items-center py-4 px-2 hover:bg-slate-50/50 rounded-lg transition-colors">
			<span className="text-sm font-medium text-slate-600">{label}</span>
			<span className="text-slate-900 font-medium">{value || "-"}</span>
		</div>
	);

	const AvailabilitySection = ({ title, data }) => (
		<div className="space-y-4">
			<h4 className="text-sm font-semibold text-slate-700">{title}</h4>
			<div className="grid grid-cols-2 gap-3">
				{Object.entries(data || {}).map(([day, time]) => (
					<div
						key={day}
						className="bg-slate-50/50 p-3 rounded-lg flex items-center gap-2">
						<span className="text-sm font-medium text-slate-600">{day}:</span>
						<span className="text-slate-900 text-sm">{time}</span>
					</div>
				))}
				{Object.entries(data || {}).length === 0 && (
					<div className="col-span-2 text-slate-400 text-sm p-3">
						Not available
					</div>
				)}
			</div>
		</div>
	);
	return (
		<div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl border border-slate-200/60 shadow-xl shadow-indigo-100/20 hover:shadow-2xl transition-shadow duration-300" aria-labelledby="mhp-profile-heading">
			<h3 id="mhp-profile-heading" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-8">MHP Profile</h3>
			{isEditing ? (
				<div className="space-y-8">
					{/* Editable fields */}
					<div className="grid grid-cols-1 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-600" htmlFor="mobileNumber">Mobile Number</label>
							<input id="mobileNumber" type="text" name="mobileNumber" value={profileData.mobileNumber} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200/60 rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-200/80 focus:border-indigo-300/50 transition-all outline-none placeholder:text-slate-400/80" placeholder="Enter mobile number" />
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-600" htmlFor="location">Location</label>
							<input id="location" type="text" name="location" value={profileData.location} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200/60 rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-200/80 focus:border-indigo-300/50 transition-all outline-none placeholder:text-slate-400/80" placeholder="Enter location" />
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-600" htmlFor="education">Education</label>
							<input id="education" type="text" name="education" value={profileData.education} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200/60 rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-200/80 focus:border-indigo-300/50 transition-all outline-none placeholder:text-slate-400/80" placeholder="Enter educational qualification" />
						</div>
					</div>
					{/* Availability Sections */}
					<div className="space-y-8">
						<div className="space-y-6">
							<h4 className="text-lg font-semibold text-slate-800">Online Availability</h4>
							<div className="space-y-4">
								{days.map((day) => (
									<div key={day} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-xl">
										<input type="checkbox" className="h-5 w-5 text-indigo-600 rounded-lg border-2 border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 focus:ring-indigo-200/80 transition-all" onChange={(e) => handleDayToggle("rosterOnline", day, e.target.checked)} checked={profileData.rosterOnline[day] !== undefined} aria-label={`Toggle online availability for ${day}`} />
										<span className="w-20 font-medium text-slate-700">{day}</span>
										{profileData.rosterOnline[day] !== undefined && (
											<input type="text" value={profileData.rosterOnline[day]} onChange={(e) => handleTimeChange("rosterOnline", day, e.target.value)} placeholder="9 AM - 5 PM" className="flex-1 px-4 py-2.5 border border-slate-200/60 rounded-lg bg-white/70 focus:ring-2 focus:ring-indigo-200/80 focus:border-indigo-300/50 transition-all outline-none placeholder:text-slate-400/80 text-sm" />
										)}
									</div>
								))}
							</div>
						</div>
						<div className="space-y-6">
							<h4 className="text-lg font-semibold text-slate-800">Offline Availability</h4>
							<div className="space-y-4">
								{days.map((day) => (
									<div key={day} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-xl">
										<input type="checkbox" className="h-5 w-5 text-indigo-600 rounded-lg border-2 border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 focus:ring-indigo-200/80 transition-all" onChange={(e) => handleDayToggle("rosterOffline", day, e.target.checked)} checked={profileData.rosterOffline[day] !== undefined} aria-label={`Toggle offline availability for ${day}`} />
										<span className="w-20 font-medium text-slate-700">{day}</span>
										{profileData.rosterOffline[day] !== undefined && (
											<input type="text" value={profileData.rosterOffline[day]} onChange={(e) => handleTimeChange("rosterOffline", day, e.target.value)} placeholder="9 AM - 5 PM" className="flex-1 px-4 py-2.5 border border-slate-200/60 rounded-lg bg-white/70 focus:ring-2 focus:ring-indigo-200/80 focus:border-indigo-300/50 transition-all outline-none placeholder:text-slate-400/80 text-sm" />
										)}
									</div>
								))}
							</div>
						</div>
					</div>
					<button onClick={handleSave} disabled={saving} className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-teal-500 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] shadow-md hover:shadow-indigo-200/40 active:scale-95 text-sm" aria-busy={saving}>{saving ? "Saving..." : "Save Changes"}</button>
				</div>
			) : (
				<div className="space-y-8">
					<div className="divide-y divide-slate-200/60" aria-label="Profile details">
						<ProfileRow label="Username" value={profileData.username} />
						<ProfileRow label="Licence Number" value={profileData.licenseNumber || profileData.bmdcRegNo} />
						<ProfileRow label="Email" value={profileData.email} />
						<ProfileRow label="Mobile Number" value={profileData.mobileNumber} />
						<ProfileRow label="Location" value={profileData.location} />
						<ProfileRow label="Education" value={profileData.education} />
					</div>
					<div className="space-y-6">
						<AvailabilitySection title="Online Availability" data={profileData.rosterOnline} />
						<AvailabilitySection title="Offline Availability" data={profileData.rosterOffline} />
					</div>
					<button onClick={() => setIsEditing(true)} className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-teal-500 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] shadow-md hover:shadow-indigo-200/40 active:scale-95 text-sm">Edit Profile</button>
				</div>
			)}
		</div>
	);
};

export default MHPProfile;
