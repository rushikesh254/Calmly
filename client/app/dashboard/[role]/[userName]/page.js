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

// Dashboard entry for dynamic route /dashboard/[role]/[userName]
// Goal: keep behavior/UI identical while making intent clearer via tiny helpers and comments.
export default function DashboardPage({ params }) {
	const router = useRouter();
	const { role, userName } = useParams(); // current route params

	// Local state mirrors auth-derived role and email; null means "still resolving"
	const [userType, setUserType] = useState(null);
	const [email, setEmail] = useState(null);

	// Safe localStorage accessor (no behavioral change, just tidy)
	const readLS = (key) =>
		typeof window !== "undefined" && window.localStorage
			? window.localStorage.getItem(key)
			: null;

	useEffect(() => {
		// Read email once for child components
		setEmail(readLS("email"));
	}, []);

	useEffect(() => {
		// Verify auth and keep URL/role in sync with stored session
		const verifyAuth = () => {
			const storedRole = readLS("userType");
			const storedUserName = readLS("userName");

			// No session → go to sign-in
			if (!storedRole || !storedUserName) {
				router.push("/signin");
				return;
			}

			// Mismatch between URL role and session role → sign-in
			if (storedRole !== role) {
				router.push("/signin");
				return;
			}

			// If username differs only by casing/value, repair URL without logging out
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

			// Everything matches → allow render
			setUserType(storedRole);
		};

		verifyAuth();
	}, [router, role, userName]);

	// Lightweight loading while we confirm session state
	if (!userType) {
		return (
			<LoadingPage
				text="Loading your dashboard..."
				subtitle="Preparing your personalized experience"
			/>
		);
	}

	// Render role-specific dashboard
	return (
		<>
			{userType === "attendee" && (
				<AttendeeDashboard userName={userName} email={email} />
			)}
			{userType === "mhp" && <MHPDashboard userName={userName} email={email} />}
		</>
	);
}
