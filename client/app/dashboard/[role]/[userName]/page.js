"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AttendeeDashboard } from "./attendee-dashboard";
import { MHPDashboard } from "./mhp-dashboard";
import { LoadingPage } from "@/components/ui/loading";

export default function DashboardPage({ params }) {
	const router = useRouter();
	const { role, userName } = useParams(); // current route params

	const [userType, setUserType] = useState(null);
	const [email, setEmail] = useState(null);

	const readLS = (key) =>
		typeof window !== "undefined" && window.localStorage
			? window.localStorage.getItem(key)
			: null;

	useEffect(() => {
		setEmail(readLS("email"));
	}, []);

	useEffect(() => {
		const verifyAuth = () => {
			const storedRole = readLS("userType");
			const storedUserName = readLS("userName");

			if (!storedRole || !storedUserName) {
				router.push("/signin");
				return;
			}

			if (storedRole !== role) {
				router.push("/signin");
				return;
			}

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
