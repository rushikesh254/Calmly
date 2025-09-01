"use client";
import React, { useState, useEffect } from "react";

// Fetch the attendee profile from the API for the given username
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

// Update the attendee profile for the given username with provided payload
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
	// UI state
	const [editing, setEditing] = useState(false);
	const [profile, setProfile] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);

	// Load profile when username changes
	useEffect(() => {
		const loadProfileData = async () => {
			try {
				const data = await getAttendeeProfile(userName);
				setProfile(data);
			} catch {
				setErrorMessage("Error loading profile data");
			}
		};
		if (userName) loadProfileData();
	}, [userName]);

	// Controlled input handler
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProfile((prev) => ({ ...prev, [name]: value }));
	};

	// Save changes to the API
	const handleSaveChanges = async () => {
		try {
			const updated = await saveAttendeeProfile(userName, profile);
			setProfile(updated.attendee);
			setEditing(false);
		} catch {
			setErrorMessage("Error saving profile data");
		}
	};

	if (errorMessage) return <div className="text-red-600">{errorMessage}</div>;

	// Reusable row for read-only profile fields
	const ProfileRowItem = ({ label, value }) => (
		<div className="flex justify-between items-center py-4 px-2 hover:bg-slate-50/50 rounded-lg transition-colors">
			<span className="text-sm font-medium text-slate-600">{label}</span>
			<span className="text-slate-900 font-medium">{value || "-"}</span>
		</div>
	);

	return (
		<div className="max-w-2xl mx-auto mt-10">
			<div
				className="p-8 rounded-2xl border border-slate-200/60
					  bg-white/80 backdrop-blur-lg
					  hover:border-indigo-200/80 hover:shadow-2xl
					  transition-all duration-300 hover:-translate-y-2
					  shadow-xl shadow-indigo-100/20">
				<h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-8">
					Attendee Profile
				</h3>
				{editing ? (
					<div className="space-y-6">
						{/* Read-only fields */}
						<div className="space-y-4">
							<div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/40">
								<label className="text-sm font-medium text-slate-500">
									Username
								</label>
								<p className="mt-1 text-slate-900 font-medium">
									{profile.username}
								</p>
							</div>
							<div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/40">
								<label className="text-sm font-medium text-slate-500">
									Email
								</label>
								<p className="mt-1 text-slate-900 font-medium">
									{profile.email}
								</p>
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
									className="w-full px-4 py-3 border border-slate-200/60 rounded-xl 
							bg-white/70 focus:ring-2 focus:ring-indigo-200/80 
							focus:border-indigo-300/50 transition-all outline-none
							placeholder:text-slate-400/80"
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
									className="w-full px-4 py-3 border border-slate-200/60 rounded-xl 
							bg-white/70 focus:ring-2 focus:ring-indigo-200/80 
							focus:border-indigo-300/50 transition-all outline-none
							placeholder:text-slate-400/80"
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
										className="w-full px-4 py-3 border border-slate-200/60 rounded-xl 
							  bg-white/70 focus:ring-2 focus:ring-indigo-200/80 
							  focus:border-indigo-300/50 transition-all outline-none"
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
										className="w-full px-4 py-3 border border-slate-200/60 rounded-xl 
							  bg-white/70 focus:ring-2 focus:ring-indigo-200/80 
							  focus:border-indigo-300/50 transition-all outline-none">
										<option value="">Select Sex</option>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">Other</option>
									</select>
								</div>
							</div>
						</div>

						<button
							onClick={handleSaveChanges}
							className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-teal-500 text-white 
						rounded-lg font-semibold hover:from-indigo-700 hover:to-teal-600 
						transition-all transform hover:scale-[1.02] shadow-md hover:shadow-indigo-200/40
						active:scale-95 text-sm">
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
							className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-teal-500 text-white 
						rounded-lg font-semibold hover:from-indigo-700 hover:to-teal-600 
						transition-all transform hover:scale-[1.02] shadow-md hover:shadow-indigo-200/40
						active:scale-95 text-sm">
							Edit Profile
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AttendeeProfile;
