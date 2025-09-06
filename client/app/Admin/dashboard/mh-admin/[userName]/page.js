"use client";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { MHAdminDashboard } from "./mh-admin-dashboard";

export default function MHAdminDashboardPage({ params }) {
	const router = useRouter();
	const { userName } = params;
	const [authVerified, setAuthVerified] = useState(false);
	const [email, setEmail] = useState(null);

	useEffect(() => {
		// Check if localStorage is available (running in the browser)
		if (typeof window !== "undefined" && window.localStorage) {
			const storedEmail = localStorage.getItem("email");
			// console.log("Email: ", storedEmail);
			setEmail(storedEmail);
		}
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		const storedUserName = localStorage.getItem("userName");

		if (!token) {
			router.push("/admin");
			return;
		}
		try {
			const decoded = jwtDecode(token);
			if (decoded.role !== "mh-admin" || storedUserName !== userName) {
				router.push("/admin");
			} else {
				setAuthVerified(true);
			}
		} catch {
			localStorage.removeItem("accessToken");
			router.push("/admin");
		}
	}, [router, userName]);

	if (!authVerified) {
		return (
			<div className="min-h-dvh flex items-center justify-center">
				<div>Loading dashboard...</div>
			</div>
		);
	}

	return <MHAdminDashboard userName={userName} email={email} />;
}
