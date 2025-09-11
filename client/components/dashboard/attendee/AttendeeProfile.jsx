"use client";
import React, { useState, useEffect } from "react";

const fetchProfile = async (userName) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/attendees/${userName}`
  );
  if (!res.ok) throw new Error("load fail");
  return res.json();
};

const updateProfile = async (userName, data) => {
  const token =
    typeof window === "undefined"
      ? null
      : localStorage.getItem("token") || localStorage.getItem("accessToken");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/attendees/${userName}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error("save fail");
  return res.json();
};

const classes = {
  card: "p-8 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-lg hover:border-indigo-200/80 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 shadow-xl shadow-indigo-100/20",
  title:
    "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-8",
  box: "bg-slate-50/50 p-4 rounded-xl border border-slate-200/40",
  boxLabel: "text-sm font-medium text-slate-500",
  boxValue: "mt-1 text-slate-900 font-medium",
  row: "flex justify-between items-center py-4 px-2 hover:bg-slate-50/50 rounded-lg transition-colors",
  rowLabel: "text-sm font-medium text-slate-600",
  rowValue: "text-slate-900 font-medium",
  inputBase:
    "w-full px-4 py-3 border border-slate-200/60 rounded-xl bg-white/70 focus:ring-2 focus:ring-indigo-200/80 focus:border-indigo-300/50 transition-all outline-none",
  primaryBtn:
    "w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-teal-500 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] shadow-md hover:shadow-indigo-200/40 active:scale-95 text-sm",
};

const FieldRow = ({ label, value }) => (
  <div className={classes.row}>
    <span className={classes.rowLabel}>{label}</span>
    <span className={classes.rowValue}>{value || "-"}</span>
  </div>
);

const AttendeeProfile = ({ userName }) => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({});
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!userName) return;
    fetchProfile(userName)
      .then(setProfile)
      .catch(() => setErr("Error loading profile"));
  }, [userName]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const onSave = async () => {
    try {
      const updated = await updateProfile(userName, profile);
      setProfile(updated.attendee);
      setEditing(false);
    } catch {
      setErr("Error saving profile");
    }
  };

  if (err) return <div className="text-red-600">{err}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className={classes.card}>
        <h3 className={classes.title}>Attendee Profile</h3>
        {editing ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className={classes.box}>
                <label className={classes.boxLabel}>Username</label>
                <p className={classes.boxValue}>{profile.username}</p>
              </div>
              <div className={classes.box}>
                <label className={classes.boxLabel}>Email</label>
                <p className={classes.boxValue}>{profile.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profile.address || ""}
                  onChange={onChange}
                  className={`${classes.inputBase} placeholder:text-slate-400/80`}
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
                  onChange={onChange}
                  className={`${classes.inputBase} placeholder:text-slate-400/80`}
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
                    onChange={onChange}
                    className={classes.inputBase}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">
                    Sex
                  </label>
                  <select
                    name="sex"
                    value={profile.sex || ""}
                    onChange={onChange}
                    className={classes.inputBase}
                  >
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <button onClick={onSave} className={classes.primaryBtn}>
              Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="divide-y divide-slate-200/60">
              <FieldRow label="Username" value={profile.username} />
              <FieldRow label="Email" value={profile.email} />
              <FieldRow label="Address" value={profile.address} />
              <FieldRow label="Phone Number" value={profile.phoneNumber} />
              <FieldRow label="Age" value={profile.age} />
              <FieldRow label="Sex" value={profile.sex} />
            </div>
            <button
              onClick={() => setEditing(true)}
              className={classes.primaryBtn}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeeProfile;
