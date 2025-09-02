"use client";
import React, { useState, useEffect } from "react";

// Fetch the attendee profile for a given username
const getAttendeeProfile = async (userName) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/attendees/${userName}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);
	if (!response.ok) throw new Error("Error fetching profile data");
	return await response.json();
};

// Update the attendee profile for a given username with the provided payload
const saveAttendeeProfile = async (userName, profile) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/attendees/${userName}`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(profile),
		}
	);
	if (!response.ok) throw new Error("Failed to update profile");
	return await response.json();
};

const AttendeeProfile = ({ userName }) => {
	// Alias for readability without changing the public prop name
	const username = userName;

	// UI state
	const [editing, setEditing] = useState(false);
	const [profile, setProfile] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);

	// Reusable class names (kept identical to preserve UI)
	const cardClass =
		"p-8 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-lg hover:border-indigo-200/80 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 shadow-xl shadow-indigo-100/20";
	const sectionTitleClass =
		"text-2xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-8";
	const readOnlyBoxClass =
		"bg-slate-50/50 p-4 rounded-xl border border-slate-200/40";
	const readOnlyLabelClass = "text-sm font-medium text-slate-500";
	const readOnlyValueClass = "mt-1 text-slate-900 font-medium";
	const rowContainerClass =
		"flex justify-between items-center py-4 px-2 hover:bg-slate-50/50 rounded-lg transition-colors";
	const rowLabelClass = "text-sm font-medium text-slate-600";
	const rowValueClass = "text-slate-900 font-medium";
	const inputBaseClass =
		"w-full px-4 py-3 border border-slate-200/60 rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-200/80 focus:border-indigo-300/50 transition-all outline-none";
	const textInputClass = `${inputBaseClass} placeholder:text-slate-400/80`;
	const selectClass = inputBaseClass;
	const primaryButtonClass =
		"w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-teal-500 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] shadow-md hover:shadow-indigo-200/40 active:scale-95 text-sm";

	// Load profile when username changes
	useEffect(() => {
		const loadProfileData = async () => {
			try {
				const data = await getAttendeeProfile(username);
				setProfile(data);
			} catch {
				setErrorMessage("Error loading profile data");
			}
		};
		if (username) loadProfileData();
	}, [username]);

	// Controlled input handler
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProfile((prev) => ({ ...prev, [name]: value }));
	};

	// Save changes to the API
	const handleSaveChanges = async () => {
		try {
			const updated = await saveAttendeeProfile(username, profile);
			setProfile(updated.attendee);
			setEditing(false);
		} catch {
			setErrorMessage("Error saving profile data");
		}
	};

	if (errorMessage) return <div className="text-red-600">{errorMessage}</div>;

	// Reusable row for read-only profile fields
	const ProfileRowItem = ({ label, value }) => (
		<div className={rowContainerClass}>
			<span className={rowLabelClass}>{label}</span>
			<span className={rowValueClass}>{value || "-"}</span>
		</div>
	);

	return (
		<div className="max-w-2xl mx-auto mt-10">
			<div className={cardClass}>
				<h3 className={sectionTitleClass}>Attendee Profile</h3>
				{editing ? (
					<div className="space-y-6">
						{/* Read-only fields */}
						<div className="space-y-4">
							<div className={readOnlyBoxClass}>
								<label className={readOnlyLabelClass}>Username</label>
								<p className={readOnlyValueClass}>{profile.username}</p>
							</div>
							<div className={readOnlyBoxClass}>
								<label className={readOnlyLabelClass}>Email</label>
								<p className={readOnlyValueClass}>{profile.email}</p>
							</div>
						</div>

						{/* Editable fields */}
						<div className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-slate-600">
									Address
								</label>
								<input
									type="text"
									name="address"
									value={profile.address || ""}
									onChange={handleInputChange}
									className={textInputClass}
									placeholder="Enter your address"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-slate-600">
									Contact Number
								</label>
								<input
									type="text"
									name="phoneNumber"
									value={profile.phoneNumber || ""}
									onChange={handleInputChange}
									className={textInputClass}
									placeholder="Enter phone number"
								/>
							</div>

							<div className="grid grid-cols-2 gap-6">
								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-600">
										Age
									</label>
									<input
										type="number"
										name="age"
										value={profile.age || ""}
										onChange={handleInputChange}
										className={selectClass}
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-600">
										Sex
									</label>
									<select
										name="sex"
										value={profile.sex || ""}
										onChange={handleInputChange}
										className={selectClass}>
										<option value="">Select Sex</option>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">Other</option>
									</select>
								</div>
							</div>
						</div>

						<button onClick={handleSaveChanges} className={primaryButtonClass}>
							Save Changes
						</button>
					</div>
				) : (
					<div className="space-y-6">
						<div className="divide-y divide-slate-200/60">
							<ProfileRowItem label="Username" value={profile.username} />
							<ProfileRowItem label="Email" value={profile.email} />
							<ProfileRowItem label="Address" value={profile.address} />
							<ProfileRowItem
								label="Phone Number"
								value={profile.phoneNumber}
							/>
							<ProfileRowItem label="Age" value={profile.age} />
							<ProfileRowItem label="Sex" value={profile.sex} />
						</div>

						<button
							onClick={() => setEditing(true)}
							className={primaryButtonClass}>
							Edit Profile
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AttendeeProfile;
