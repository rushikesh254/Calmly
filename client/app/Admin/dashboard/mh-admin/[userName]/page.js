"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { MHAdminDashboard } from "./mh-admin-dashboard";

// Updated to use useParams to avoid Next.js dynamic params warning
export default function MHAdminDashboardPage() {
	const { userName } = useParams();
	const router = useRouter();

	const [authVerified, setAuthVerified] = useState(false);
	const [email, setEmail] = useState(null);

	useEffect(() => {
		try {
			const storedEmail = typeof window !== "undefined" ? localStorage.getItem("email") : null;
			setEmail(storedEmail);
		} catch {
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
			const roleMatches = decoded?.role === "mh-admin";
			const userMatches = storedUserName === userName;

			if (roleMatches && userMatches) {
				setAuthVerified(true);
			} else {
				router.push("/admin");
			}
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

	return <MHAdminDashboard userName={userName} email={email} />;
}
