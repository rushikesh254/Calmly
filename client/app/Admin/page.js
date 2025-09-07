"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginForm } from "./components/AdminLoginForm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL; // Expected to be defined in env.

const AdminLoginPage = () => {
	// Form state
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	// Clear stale error automatically after a short delay (visual polish only)
	useEffect(() => {
		if (!error) return;
		const t = setTimeout(() => setError(""), 5000);
		return () => clearTimeout(t);
	}, [error]);

	const router = useRouter();

	const goToRoleDashboard = (role, userName) => {
		if (role === "general-admin") {
			router.push(`/admin/dashboard/general-admin/${userName}`);
			return true;
		}
		if (role === "mh-admin") {
			router.push(`/admin/dashboard/mh-admin/${userName}`);
			return true;
		}
		return false;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!email.trim() || !password) {
			setError("Email and password are required");
			return;
		}

		try {
			const response = await fetch(`${API_BASE}/api/admin/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			let data;
			try {
				data = await response.json();
			} catch {
				data = {};
			}

			if (response.ok) {
				if (data?.accessToken) localStorage.setItem("accessToken", data.accessToken);
				if (data?.userName) localStorage.setItem("userName", data.userName);

				if (!goToRoleDashboard(data?.role, data?.userName)) {
					setError("Role not recognized");
				}
			} else {
				setError(data?.message || "Authentication failed");
			}
		} catch {
			setError("Failed to connect to server");
		}
	};

	return (
		<>
			<div className="sr-only" aria-live="polite">
				{error ? `Authentication error: ${error}` : "Enter admin credentials"}
			</div>
			<AdminLoginForm
				email={email}
				password={password}
				error={error}
				handleEmailChange={(e) => setEmail(e.target.value)}
				handlePasswordChange={(e) => setPassword(e.target.value)}
				handleSubmit={handleSubmit}
			/>
		</>
	);
};

export default AdminLoginPage;
