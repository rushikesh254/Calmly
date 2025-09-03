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

export const AttendeeDashboard = ({ userName, email }) => {
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
			case "journal":
				return (
					<div className="text-center py-12">
						<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
							Journal Feature
						</h2>
						<p className="text-slate-600 dark:text-slate-400">
							Coming soon! This feature will allow you to write and reflect on
							your thoughts.
						</p>
					</div>
				);
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
