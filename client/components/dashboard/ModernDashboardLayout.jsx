"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import {
	LayoutDashboard,
	Calendar,
	BookOpen,
	TrendingUp,
	FileText,
	Settings,
	Users,
	LogOut,
	Menu,
	X,
	Heart,
	User,
	Bell,
} from "lucide-react";
import { ErrorBoundary } from "@/components/dashboard/ErrorBoundary";

export const ModernDashboardLayout = ({
	role,
	userName,
	email,
	children,
	currentSection,
	onSectionChange,
}) => {
	const router = useRouter();
	const [activeSection, setActiveSection] = useState("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);
	const mainRef = useRef(null);
	const overlaySidebar = role === "attendee" || role === "mhp";

	// Sync active section with URL hash and track desktop breakpoint
	useEffect(() => {
		if (typeof window === "undefined") return;

		const updateFromHash = () => {
			const hashValue = window.location.hash.slice(1) || "dashboard";
			setActiveSection(hashValue);
		};

		const mq = window.matchMedia("(min-width: 1024px)");
		const handleMQ = (e) => setIsDesktop(e.matches);

		// Initialize
		updateFromHash();
		handleMQ(mq);

		// Listeners
		window.addEventListener("hashchange", updateFromHash);
		mq.addEventListener
			? mq.addEventListener("change", handleMQ)
			: mq.addListener(handleMQ);

		return () => {
			window.removeEventListener("hashchange", updateFromHash);
			mq.removeEventListener
				? mq.removeEventListener("change", handleMQ)
				: mq.removeListener(handleMQ);
		};
	}, []);

	// Sync with parent when provided
	useEffect(() => {
		if (currentSection) setActiveSection(currentSection);
	}, [currentSection]);

	// Lock body scroll on mobile when sidebar open
	useEffect(() => {
		if (typeof document === "undefined") return;
		const root = document.documentElement;
		if (!isDesktop && sidebarOpen) {
			root.classList.add("overflow-hidden");
		} else {
			root.classList.remove("overflow-hidden");
		}
		return () => root.classList.remove("overflow-hidden");
	}, [sidebarOpen, isDesktop]);

	const handleSectionChange = (section) => {
		setActiveSection(section);
		setSidebarOpen(false);
		if (typeof window !== "undefined") window.location.hash = section;
		else router.push(`/dashboard/${role}/${userName}#${section}`);
		if (typeof onSectionChange === "function") {
			onSectionChange(section);
		}
		// Reset scroll
		if (mainRef.current) {
			try {
				mainRef.current.scrollTo({ top: 0, behavior: "instant" });
			} catch (e) {
				mainRef.current.scrollTop = 0;
			}
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("accessToken");
		router.push("/signin");
	};

	const navItems = {
		attendee: [
			{
				name: "Dashboard",
				section: "dashboard",
				icon: <LayoutDashboard className="w-5 h-5" />,
			},
			{
				name: "Sessions",
				section: "sessions",
				icon: <Calendar className="w-5 h-5" />,
			},
			{
				name: "Resources",
				section: "resources",
				icon: <BookOpen className="w-5 h-5" />,
			},
			{
				name: "Professionals",
				section: "professionals",
				icon: <Users className="w-5 h-5" />,
			},
			{
				name: "Mood Tracker",
				section: "moodtracker",
				icon: <TrendingUp className="w-5 h-5" />,
			},
			{
				name: "AI Assistant",
				section: "assistant",
				icon: <Heart className="w-5 h-5" />,
			},
			{
				name: "Journal",
				section: "journal",
				icon: <FileText className="w-5 h-5" />,
			},
		],
		mhp: [
			{
				name: "Dashboard",
				section: "dashboard",
				icon: <LayoutDashboard className="w-5 h-5" />,
			},
			{
				name: "Sessions",
				section: "sessions",
				icon: <Calendar className="w-5 h-5" />,
			},
			{
				name: "Resources",
				section: "resources",
				icon: <BookOpen className="w-5 h-5" />,
			},
			{
				name: "Clients",
				section: "clients",
				icon: <Users className="w-5 h-5" />,
			},
		],
		admin: [
			{
				name: "Dashboard",
				section: "dashboard",
				icon: <LayoutDashboard className="w-5 h-5" />,
			},
			{
				name: "Users",
				section: "users",
				icon: <Users className="w-5 h-5" />,
			},
			{
				name: "Sessions",
				section: "sessions",
				icon: <Calendar className="w-5 h-5" />,
			},
			{
				name: "Resources",
				section: "resources",
				icon: <BookOpen className="w-5 h-5" />,
			},
			{
				name: "Analytics",
				section: "analytics",
				icon: <TrendingUp className="w-5 h-5" />,
			},
			{
				name: "Settings",
				section: "settings",
				icon: <Settings className="w-5 h-5" />,
			},
		],
	};

	const currentNavItems = navItems[role] || navItems.attendee;

	return (
		<div className="h-dvh overflow-hidden overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dashboard-root">
			{/* Mobile Sidebar Overlay */}
			<AnimatePresence>
				{sidebarOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className={`${
							overlaySidebar ? "" : "lg:hidden"
						} fixed inset-0 z-40 bg-black/50 backdrop-blur-sm`}
						onClick={() => setSidebarOpen(false)}
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<motion.aside
				initial={false}
				animate={{
					x: overlaySidebar
						? sidebarOpen
							? 0
							: "-100%"
						: isDesktop
						? 0
						: sidebarOpen
						? 0
						: "-100%",
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className={`fixed inset-y-0 left-0 z-50 w-72 pt-16 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-r border-slate-200/60 dark:border-slate-700/60 shadow-2xl h-[calc(100vh-4rem)] supports-[height:100dvh]:h-[calc(100dvh-4rem)] overflow-y-auto no-scrollbar ${
					overlaySidebar ? "" : "lg:translate-x-0 lg:static lg:inset-0"
				}`}
				role="navigation"
				aria-label="Primary"
				id="primary-sidebar">
				<div className="flex flex-col h-full">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="flex items-center justify-between p-4">
						<motion.div
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2 }}>
							<Link href="/" className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
									<Heart className="w-6 h-6 text-white" />
								</div>
								<span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
									Calmly
								</span>
							</Link>
						</motion.div>
						<Button
							variant="ghost"
							size="icon"
							className={`${
								overlaySidebar ? "" : "lg:hidden"
							} hover:bg-slate-100 dark:hover:bg-slate-700`}
							onClick={() => setSidebarOpen(false)}
							aria-label="Close navigation"
							aria-controls="primary-sidebar">
							<X className="w-5 h-5" />
						</Button>
					</motion.div>

					{/* User Info */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="p-4">
						<div className="flex items-center space-x-4">
							<motion.div
								whileHover={{ scale: 1.1, rotate: 5 }}
								transition={{ duration: 0.3 }}
								className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
								<User className="w-6 h-6 text-white" />
							</motion.div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
									{userName}
								</p>
								<p className="text-xs text-slate-500 dark:text-slate-400 truncate">
									{email}
								</p>
								<p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium capitalize">
									{role}
								</p>
							</div>
						</div>
					</motion.div>

					{/* Navigation */}
					<nav className="flex-1 p-4 space-y-2">
						{currentNavItems.map((item, index) => (
							<motion.button
								key={item.section}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
								whileHover={{ scale: 1.02, x: 4 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => handleSectionChange(item.section)}
								aria-current={
									activeSection === item.section ? "page" : undefined
								}
								className={`w-full flex items-center space-x-4 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
									activeSection === item.section
										? "bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/50 dark:to-blue-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-700/60 shadow-lg"
										: "text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white hover:shadow-md"
								}`}>
								<span className="flex-shrink-0">{item.icon}</span>
								<span>{item.name}</span>
							</motion.button>
						))}
					</nav>

					{/* Footer */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
						<motion.button
							whileHover={{ scale: 1.02, x: 4 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleLogout}
							className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
							<LogOut className="w-5 h-5" />
							<span>Logout</span>
						</motion.button>
					</motion.div>
				</div>
			</motion.aside>

			{/* Main Content */}
			<div
				className={`${
					overlaySidebar ? "" : "lg:pl-72"
				} flex flex-col h-dvh overflow-hidden min-w-0`}>
				{/* Top Bar */}
				<motion.header
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className={`fixed top-0 right-0 left-0 ${
						overlaySidebar ? "" : "lg:left-72"
					} z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60 h-16 px-6 shadow-sm`}
					role="banner">
					<div className="h-full flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className={`${
									overlaySidebar ? "" : "lg:hidden"
								} p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200`}
								onClick={() => setSidebarOpen(true)}
								aria-label="Open navigation"
								aria-controls="primary-sidebar"
								aria-expanded={sidebarOpen}>
								<Menu className="w-5 h-5" />
							</motion.button>
							<motion.h1
								key={activeSection}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3 }}
								className="text-xl font-semibold text-slate-900 dark:text-white capitalize">
								{activeSection}
							</motion.h1>
						</div>
						<div className="flex items-center space-x-4">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
								aria-label="Notifications">
								<Bell className="w-5 h-5" />
							</motion.button>
							<ThemeToggle />
						</div>
					</div>
				</motion.header>

				{/* Page Content */}
				<motion.main
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="pt-16 h-[calc(100vh-4rem)] supports-[height:100dvh]:h-[calc(100dvh-4rem)] overflow-y-auto no-scrollbar px-6 pb-6"
					ref={mainRef}
					role="main"
					aria-live="polite">
					<div className="max-w-7xl mx-auto">
						<AnimatePresence mode="wait">
							<motion.div
								key={activeSection}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}>
								<ErrorBoundary>
									{children || (
										<div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
											This section has no content yet.
										</div>
									)}
								</ErrorBoundary>
							</motion.div>
						</AnimatePresence>
					</div>
				</motion.main>
			</div>
		</div>
	);
};
