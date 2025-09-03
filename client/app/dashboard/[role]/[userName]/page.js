/**
 * Dashboard Page for Calmly Mental Health Platform
 * @author Rushikesh Bodke
 */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AttendeeDashboard } from "./attendee-dashboard";
import { MHPDashboard } from "./mhp-dashboard";
import { LoadingPage } from "@/components/ui/loading";

export default function DashboardPage({ params }) {
	const router = useRouter();
	const [userType, setUserType] = useState(null);
	// Read route params on the client reliably
	const { role, userName } = useParams();
	const [email, setEmail] = useState(null);

	useEffect(() => {
		// Check if localStorage is available (running in the browser)
		if (typeof window !== "undefined" && window.localStorage) {
			const storedEmail = localStorage.getItem("email");
			setEmail(storedEmail);
		}
	}, []);

	useEffect(() => {
		const verifyAuth = () => {
			const storedRole = localStorage.getItem("userType");
			const storedUserName = localStorage.getItem("userName");

			if (!storedRole || !storedUserName) {
				router.push("/signin");
				return;
			}

			// If role doesn't match, send to signin
			if (storedRole !== role) {
				router.push("/signin");
				return;
			}

			// If the username casing or value differs, repair the URL instead of logging out
			if (
				userName &&
				storedUserName &&
				storedUserName.toLowerCase() !== String(userName).toLowerCase()
			) {
				const hash = typeof window !== "undefined" ? window.location.hash : "";
				router.replace(`/dashboard/${storedRole}/${storedUserName}${hash}`);
				setUserType(storedRole);
				return;
			}

			setUserType(storedRole);
		};

		verifyAuth();
	}, [router, role, userName]);

	if (!userType) {
		return (
			<LoadingPage
				text="Loading your dashboard..."
				subtitle="Preparing your personalized experience"
			/>
		);
	}

	return (
		<>
			{userType === "attendee" && (
				<AttendeeDashboard userName={userName} email={email} />
			)}
			{userType === "mhp" && <MHPDashboard userName={userName} email={email} />}
		</>
	);
}
