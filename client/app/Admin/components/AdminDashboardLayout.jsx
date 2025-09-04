"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { DashboardContent } from "../components/general-admin/Dashboard";
import { AttendeeInformation } from "../components/general-admin/AttendeeInformation";
import { MHPInformation } from "../components/general-admin/MHPInformation";
import { SessionsInformation } from "../components/general-admin/SessionsInformation";
// import { MHADashboard } from "./mh-admin/Dashboard";
import { Resources } from "./mh-admin/Resources";
import { MHPRequest } from "./mh-admin/MHPRequests";
import { ViewResources } from "./mh-admin/ViewResources";
import { ThemeToggle } from "@/components/theme-toggle";

// Section keys kept in one place to avoid typos and keep comparisons consistent
const SECTION = {
	ANALYTICS_USERS: "analytics-users",
	ATTENDEES: "attendees",
	MHP: "mhp",
	SESSIONS: "sessions",
	LOGOUT: "logout",
	MHP_REQUEST: "mhp-request",
	RESOURCE_UPLOAD: "resourceUpload",
	RESOURCES_SHOW: "resourcesShow",
};

// Default landing section per role
const getInitialSection = (role) =>
	role === "general-admin" ? SECTION.ANALYTICS_USERS : SECTION.MHP_REQUEST;

// Static nav configuration per role (icons unchanged)
const NAV_ITEMS = {
	"general-admin": [
		{
			name: "Analytics & Users",
			section: SECTION.ANALYTICS_USERS,
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 24 24"
					fill="currentColor">
					<path d="M5 3a2 2 0 00-2 2v13a3 3 0 003 3h12a3 3 0 003-3V5a2 2 0 00-2-2H5zm2 4h2v9H7V7zm5 3h-2v6h2v-6zm3-2h2v8h-2V8z" />
				</svg>
			),
		},
		{
			name: "Attendees Information",
			section: SECTION.ATTENDEES,
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
				</svg>
			),
		},
		{
			name: "MHP Information",
			section: SECTION.MHP,
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 24 24"
					fill="currentColor">
					<path d="M12 2a5 5 0 105 5v2.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 9.5V7a5 5 0 005-5zm6 14.5a1.5 1.5 0 011.5 1.5v2a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 014 20v-2a1.5 1.5 0 011.5-1.5H18zM12 14a4 4 0 00-4 4v1h8v-1a4 4 0 00-4-4z" />
				</svg>
			),
		},
		{
			name: "Sessions Information",
			section: SECTION.SESSIONS,
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fillRule="evenodd"
						d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
		{
			name: "Logout",
			section: SECTION.LOGOUT,
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fillRule="evenodd"
						d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
	],
	"mh-admin": [
		{
			name: "MHP Request",
			section: SECTION.MHP_REQUEST,
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fillRule="evenodd"
						d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
		{
			name: "Upload Resource",
			section: SECTION.RESOURCE_UPLOAD,
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
				</svg>
			),
		},
		{
			name: "Resources",
			section: SECTION.RESOURCES_SHOW,
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
				</svg>
			),
		},
		{
			name: "Logout",
			section: SECTION.LOGOUT,
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fillRule="evenodd"
						d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
	],
};

export const AdminDashboardLayout = ({ role, userName, email, children }) => {
	const router = useRouter();
	const [activeSection, setActiveSection] = useState(getInitialSection(role));

	useEffect(() => {
		if (typeof window !== "undefined" && window.location.hash) {
			const hashValue = window.location.hash.slice(1);
			setActiveSection(hashValue);
		}
	}, []);

	// Keep hash routing for deep links consistent with existing behavior
	const handleSectionChange = (e, section) => {
		e.preventDefault();
		setActiveSection(section);
		router.push(`/admin/dashboard/${role}/${userName}/#${section}`);
	};

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		router.push("/admin");
	};

	// Use extracted NAV_ITEMS for clarity

	return (
		<div className="flex min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 overflow-x-hidden">
			{/* Sidebar */}
			<aside className="w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-r border-slate-200/60 dark:border-slate-700/60 p-6 sticky top-0 h-dvh shadow-xl overflow-y-auto no-scrollbar">
				<div className="mb-8 p-4 bg-indigo-50/50 rounded-xl">
					<div className="flex items-center justify-between gap-3">
						<div>
							<h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent break-words">
								{userName}
							</h2>
							<p className="text-sm text-slate-600 capitalize mt-1 font-medium">
								{role.replace("-", " ")} Dashboard
							</p>
						</div>
						<ThemeToggle />
					</div>
				</div>
				<nav>
					<ul className="space-y-1">
						{NAV_ITEMS[role].map((item) => (
							<li key={item.section}>
								<button
									onClick={(e) =>
										item.section === "logout"
											? handleLogout()
											: handleSectionChange(e, item.section)
									}
									className={`w-full flex items-center p-3 text-sm font-medium rounded-xl transition-all duration-200 ${
										activeSection === item.section
											? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg"
											: "text-slate-600 hover:bg-indigo-50/50 hover:translate-x-2"
									}`}>
									<span
										className={`mr-3 ${
											activeSection === item.section
												? "text-white"
												: "text-indigo-400"
										}`}>
										{item.icon}
									</span>
									<span className="text-left flex-1">{item.name}</span>
									{item.section === "logout" && (
										<span className="ml-auto text-red-200 hover:text-red-100">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												viewBox="0 0 20 20"
												fill="currentColor">
												<path
													fillRule="evenodd"
													d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
													clipRule="evenodd"
												/>
											</svg>
										</span>
									)}
								</button>
							</li>
						))}
					</ul>
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-8">
				<div className="max-w-7xl mx-auto bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 sm:p-8 shadow-lg">
					<div className="flex items-center justify-end mb-4">
						<ThemeToggle />
					</div>
					{/* {role === "general-admin" && activeSection === "dashboard" && (
            <DashboardContent userName={userName} />
          )} */}
					{role === "general-admin" &&
						activeSection === SECTION.ANALYTICS_USERS && (
							<div className="space-y-8">{children}</div>
						)}
					{role === "general-admin" && activeSection === SECTION.ATTENDEES && (
						<AttendeeInformation userName={userName} />
					)}
					{role === "general-admin" && activeSection === SECTION.MHP && (
						<MHPInformation userName={userName} />
					)}
					{role === "general-admin" && activeSection === SECTION.SESSIONS && (
						<SessionsInformation userName={userName} />
					)}
					{/* {role === "mh-admin" && activeSection === "dashboard" && <MHADashboard userName={userName}/>} */}
					{role === "mh-admin" && activeSection === SECTION.MHP_REQUEST && (
						<MHPRequest />
					)}
					{role === "mh-admin" && activeSection === SECTION.RESOURCE_UPLOAD && (
						<Resources userName={userName} email={email} />
					)}
					{role === "mh-admin" && activeSection === SECTION.RESOURCES_SHOW && (
						<ViewResources />
					)}
				</div>
			</main>
		</div>
	);
};
