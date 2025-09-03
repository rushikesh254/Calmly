"use client";
import { useEffect, useState } from "react";
import { ModernDashboardLayout } from "@/components/dashboard/ModernDashboardLayout";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { MHPSessions } from "@/components/dashboard/mhp/MHPSessions";
import { MHPResourcesManagement } from "@/components/dashboard/mhp/ResourceManagement";
import { MyResources } from "@/components/dashboard/mhp/MyResources";
import MHPProfile from "@/components/dashboard/mhp/MHPProfile";
import AvailabilityManager from "@/components/dashboard/mhp/AvailabilityManager";
import { Clients } from "@/components/dashboard/mhp/Clients";

export const MHPDashboard = ({ userName, email }) => {
	const [activeSection, setActiveSection] = useState("dashboard");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const syncFromHash = () => {
				const hashValue = window.location.hash.slice(1) || "dashboard";
				setActiveSection(hashValue);
			};
			syncFromHash();
			window.addEventListener("hashchange", syncFromHash);
			return () => window.removeEventListener("hashchange", syncFromHash);
		}
	}, []);

	const renderContent = () => {
		switch (activeSection) {
			case "dashboard":
				return <DashboardOverview role="mhp" userName={userName} />;
			case "sessions":
				return <MHPSessions email={email} />;
			case "resources":
				return (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<MHPResourcesManagement userName={userName} email={email} />
						<MyResources email={email} />
					</div>
				);
			case "clients":
				return <Clients email={email} />;
			case "profile":
				return <MHPProfile userName={userName} />;
			case "availability":
				return <AvailabilityManager />;
			default:
				return <DashboardOverview role="mhp" userName={userName} />;
		}
	};

	return (
		<ModernDashboardLayout
			role="mhp"
			userName={userName}
			email={email}
			currentSection={activeSection}
			onSectionChange={setActiveSection}>
			{renderContent()}
		</ModernDashboardLayout>
	);
};
