"use client";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { GeneralAdminDashboard } from "./general-admin-dashboard";

// Updated to use the useParams hook (Next.js 15 requires awaiting params otherwise)
export default function GeneralAdminDashboardPage() {
	const router = useRouter();
	const { userName } = useParams();
	const [authVerified, setAuthVerified] = useState(false);
	const [email, setEmail] = useState(null);

	useEffect(() => {
		if (typeof window !== "undefined" && window.localStorage) {
			const storedEmail = localStorage.getItem("email");
			setEmail(storedEmail);
		}
	}, []);

	useEffect(() => {
		try {
			const token = localStorage.getItem("accessToken");
			const storedUserName = localStorage.getItem("userName");
			if (!token) {
				router.push("/admin");
				return;
			}
			const decoded = jwtDecode(token);
			if (decoded.role !== "general-admin" || storedUserName !== userName) {
				router.push("/admin");
				return;
			}
			setAuthVerified(true);
		} catch {
			try { localStorage.removeItem("accessToken"); } catch {}
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

	return <GeneralAdminDashboard userName={userName} email={email} />;
}
