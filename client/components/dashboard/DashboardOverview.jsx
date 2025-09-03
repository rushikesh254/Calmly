/**
 * Dashboard Overview Component for Calmly Mental Health Platform
 * Author: Rushikesh Bodke
 * Notes: Humanized for readability without changing UI or behavior
 */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	BookOpen,
	TrendingUp,
	Users,
	Clock,
	Heart,
	ArrowRight,
	Activity,
} from "lucide-react";
import Link from "next/link";

export const DashboardOverview = ({ role, userName }) => {
	// Base URL for deep links within the dashboard (username encoded for safety)
	const base = `/dashboard/${role}/${encodeURIComponent(userName || "")}`;

	// Role flags (not strictly required but clarifies intent when used)
	const isAttendee = role === "attendee";
	const isMhp = role === "mhp";
	const isAdmin = role === "admin";

	// Reusable class strings to keep JSX tidy (no visual changes)
	const wrapperClass = "space-y-8";
	const heroClass =
		"bg-gradient-to-r from-indigo-600 to-teal-500 rounded-2xl p-6 sm:p-8 text-white";
	const heroTitleClass = "text-2xl sm:text-3xl font-bold mb-2";
	const heroSubtitleClass = "text-indigo-100 text-base sm:text-lg";
	const statsGridClass =
		"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch";
	const statCardClass =
		"h-full p-6 bg-white dark:bg-slate-800 border-0 shadow-lg";
	const statTitleClass =
		"text-sm font-medium text-slate-600 dark:text-slate-400";
	const statValueClass =
		"text-2xl font-bold text-slate-900 dark:text-white truncate";
	const quickTitleClass =
		"text-2xl font-bold text-slate-900 dark:text-white mb-6";
	const actionsGridClass =
		"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch";
	const actionCardClass =
		"h-full p-6 bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl transition-shadow flex flex-col";
	const recentTitleClass =
		"text-2xl font-bold text-slate-900 dark:text-white mb-6";
	const recentCardClass = "p-6 bg-white dark:bg-slate-800 border-0 shadow-lg";
	const recentRowBase =
		"flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg";

	// Static dashboard data per role (kept exactly as before)
	const stats = {
		attendee: [
			{
				title: "Upcoming Sessions",
				value: "2",
				icon: <Calendar className="w-6 h-6" />,
				color: "text-blue-600",
				bgColor: "bg-blue-50 dark:bg-blue-900/20",
			},
			{
				title: "Resources Viewed",
				value: "12",
				icon: <BookOpen className="w-6 h-6" />,
				color: "text-green-600",
				bgColor: "bg-green-50 dark:bg-green-900/20",
			},
			{
				title: "Mood Entries",
				value: "28",
				icon: <TrendingUp className="w-6 h-6" />,
				color: "text-purple-600",
				bgColor: "bg-purple-50 dark:bg-purple-900/20",
			},
			{
				title: "Journal Entries",
				value: "15",
				icon: <Heart className="w-6 h-6" />,
				color: "text-red-600",
				bgColor: "bg-red-50 dark:bg-red-900/20",
			},
		],
		mhp: [
			{
				title: "Today's Sessions",
				value: "3",
				icon: <Calendar className="w-6 h-6" />,
				color: "text-blue-600",
				bgColor: "bg-blue-50 dark:bg-blue-900/20",
			},
			{
				title: "Active Clients",
				value: "8",
				icon: <Users className="w-6 h-6" />,
				color: "text-green-600",
				bgColor: "bg-green-50 dark:bg-green-900/20",
			},
			{
				title: "Resources Shared",
				value: "24",
				icon: <BookOpen className="w-6 h-6" />,
				color: "text-purple-600",
				bgColor: "bg-purple-50 dark:bg-purple-900/20",
			},
			{
				title: "Hours This Week",
				value: "12.5",
				icon: <Clock className="w-6 h-6" />,
				color: "text-orange-600",
				bgColor: "bg-orange-50 dark:bg-orange-900/20",
			},
		],
		admin: [
			{
				title: "Total Users",
				value: "1,247",
				icon: <Users className="w-6 h-6" />,
				color: "text-blue-600",
				bgColor: "bg-blue-50 dark:bg-blue-900/20",
			},
			{
				title: "Active Sessions",
				value: "45",
				icon: <Calendar className="w-6 h-6" />,
				color: "text-green-600",
				bgColor: "bg-green-50 dark:bg-green-900/20",
			},
			{
				title: "Resources",
				value: "156",
				icon: <BookOpen className="w-6 h-6" />,
				color: "text-purple-600",
				bgColor: "bg-purple-50 dark:bg-purple-900/20",
			},
			{
				title: "Platform Health",
				value: "98%",
				icon: <Activity className="w-6 h-6" />,
				color: "text-green-600",
				bgColor: "bg-green-50 dark:bg-green-900/20",
			},
		],
	};

	const quickActions = {
		attendee: [
			{
				title: "Book Session",
				description: "Schedule a therapy session",
				icon: <Calendar className="w-5 h-5" />,
				href: `${base}#sessions`,
				color: "bg-blue-500 hover:bg-blue-600",
			},
			{
				title: "Log Mood",
				description: "Track your emotional state",
				icon: <TrendingUp className="w-5 h-5" />,
				href: `${base}#moodtracker`,
				color: "bg-purple-500 hover:bg-purple-600",
			},
			{
				title: "Browse Resources",
				description: "Access mental health content",
				icon: <BookOpen className="w-5 h-5" />,
				href: `${base}#resources`,
				color: "bg-green-500 hover:bg-green-600",
			},
			{
				title: "Write Journal",
				description: "Reflect on your day",
				icon: <Heart className="w-5 h-5" />,
				href: `${base}#journal`,
				color: "bg-red-500 hover:bg-red-600",
			},
		],
		mhp: [
			{
				title: "View Schedule",
				description: "Check upcoming sessions",
				icon: <Calendar className="w-5 h-5" />,
				href: `${base}#sessions`,
				color: "bg-blue-500 hover:bg-blue-600",
			},
			{
				title: "Manage Clients",
				description: "View client information",
				icon: <Users className="w-5 h-5" />,
				href: `${base}#clients`,
				color: "bg-green-500 hover:bg-green-600",
			},
			{
				title: "Upload Resource",
				description: "Share content with clients",
				icon: <BookOpen className="w-5 h-5" />,
				href: `${base}#resources`,
				color: "bg-purple-500 hover:bg-purple-600",
			},
		],
		admin: [
			{
				title: "User Management",
				description: "Manage platform users",
				icon: <Users className="w-5 h-5" />,
				href: "/dashboard/admin/users",
				color: "bg-blue-500 hover:bg-blue-600",
			},
			{
				title: "Analytics",
				description: "View platform statistics",
				icon: <Activity className="w-5 h-5" />,
				href: "/dashboard/admin/analytics",
				color: "bg-green-500 hover:bg-green-600",
			},
			{
				title: "Settings",
				description: "Platform configuration",
				icon: <Heart className="w-5 h-5" />,
				href: "/dashboard/admin/settings",
				color: "bg-purple-500 hover:bg-purple-600",
			},
		],
	};

	// Current role view models
	const currentStats = stats[role] || stats.attendee;
	const currentActions = quickActions[role] || quickActions.attendee;

	return (
		<div className={wrapperClass}>
			{/* Welcome Section */}
			<div className={heroClass}>
				<h1 className={heroTitleClass}>Welcome back, {userName}! 👋</h1>
				<p className={heroSubtitleClass}>
					Ready to continue your mental health journey? Here&apos;s what&apos;s
					happening today.
				</p>
			</div>

			{/* Stats Grid */}
			<div className={statsGridClass}>
				{currentStats.map((stat, index) => (
					<Card key={index} className={statCardClass}>
						<div className="flex items-center justify-between h-full">
							<div className="min-w-0">
								<p className={statTitleClass}>{stat.title}</p>
								<p className={statValueClass}>{stat.value}</p>
							</div>
							<div className={`p-3 rounded-lg ${stat.bgColor}`}>
								<div className={stat.color}>{stat.icon}</div>
							</div>
						</div>
					</Card>
				))}
			</div>

			{/* Quick Actions */}
			<div>
				<h2 className={quickTitleClass}>Quick Actions</h2>
				<div className={actionsGridClass}>
					{currentActions.map((action, index) => (
						<Card key={index} className={actionCardClass}>
							<div className="flex items-start justify-between mb-4">
								<div className={`p-3 rounded-lg ${action.color} text-white`}>
									{action.icon}
								</div>
								<ArrowRight className="w-5 h-5 text-slate-400" />
							</div>
							<h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
								{action.title}
							</h3>
							<p className="text-slate-600 dark:text-slate-400 mb-4">
								{action.description}
							</p>
							<div className="mt-auto">
								<Link href={action.href}>
									<Button className={`w-full ${action.color} text-white`}>
										Get Started
									</Button>
								</Link>
							</div>
						</Card>
					))}
				</div>
			</div>

			{/* Recent Activity */}
			<div>
				<h2 className={recentTitleClass}>Recent Activity</h2>
				<Card className={recentCardClass}>
					<div className="space-y-4">
						<div className={recentRowBase}>
							<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
								<Calendar className="w-5 h-5 text-blue-600" />
							</div>
							<div className="flex-1">
								<p className="font-medium text-slate-900 dark:text-white">
									Session scheduled for tomorrow
								</p>
								<p className="text-sm text-slate-600 dark:text-slate-400">
									2 hours ago
								</p>
							</div>
						</div>
						<div className={recentRowBase}>
							<div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
								<TrendingUp className="w-5 h-5 text-green-600" />
							</div>
							<div className="flex-1">
								<p className="font-medium text-slate-900 dark:text-white">
									Mood logged: Feeling good (8/10)
								</p>
								<p className="text-sm text-slate-600 dark:text-slate-400">
									4 hours ago
								</p>
							</div>
						</div>
						<div className={recentRowBase}>
							<div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
								<BookOpen className="w-5 h-5 text-purple-600" />
							</div>
							<div className="flex-1">
								<p className="font-medium text-slate-900 dark:text-white">
									New resource available: &ldquo;Managing Anxiety&rdquo;
								</p>
								<p className="text-sm text-slate-600 dark:text-slate-400">
									1 day ago
								</p>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
};
