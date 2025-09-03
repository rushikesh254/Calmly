"use client";
import { useState, useEffect } from "react";
import { ModernDashboardLayout } from "@/components/dashboard/ModernDashboardLayout";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { AttendeeResources } from "@/components/dashboard/attendee/Resource";
import { Sessions } from "@/components/dashboard/attendee/Sessions";
import { Professionals } from "@/components/dashboard/attendee/Professionals";
import MoodLog from "@/components/dashboard/attendee/MoodLog";
import AIAssistant from "@/components/dashboard/attendee/AIAssistant";
import Journal from "@/components/dashboard/attendee/Journal";

// Role-specific shell for Attendees
// Behavior/UI unchanged; adds tiny helpers and clarifying comments.
export const AttendeeDashboard = ({ userName, email }) => {
	const DEFAULT_SECTION = "dashboard";
	const [activeSection, setActiveSection] = useState(DEFAULT_SECTION);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const syncFromHash = () => {
				const hashValue = window.location.hash.slice(1) || DEFAULT_SECTION;
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
				return <DashboardOverview role="attendee" userName={userName} />;
			case "resources":
				return <AttendeeResources />;
			case "sessions":
				return <Sessions email={email} />;
			case "professionals":
				return <Professionals email={email} />;
			case "moodtracker":
				return <MoodLog />;
			case "assistant":
				return <AIAssistant />;
			case "journal":
				return <Journal />;
			default:
				return <DashboardOverview role="attendee" userName={userName} />;
		}
	};

	return (
		<ModernDashboardLayout
			role="attendee"
			userName={userName}
			email={email}
			currentSection={activeSection}
			onSectionChange={setActiveSection}>
			{renderContent()}
		</ModernDashboardLayout>
	);
};
