/**
 * Sign-in Role Chooser Page
 * Provides links to attendee and MHP specific sign-in pages.
 */
"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, User, Stethoscope } from "lucide-react";

export default function SignInChooserPage() {
	return (
		<div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 overflow-x-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-teal-400/20 rounded-full blur-3xl" />
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
			</div>

			{/* Navigation */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="absolute top-6 left-6 z-10">
				<Link href="/" className="flex items-center space-x-3 group">
					<motion.div
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
						className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
						<Heart className="w-6 h-6 text-white" />
					</motion.div>
					<span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
						Calmly
					</span>
				</Link>
			</motion.div>

			{/* Theme Toggle */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="absolute top-6 right-6 z-10">
				<ThemeToggle />
			</motion.div>

			{/* Main Card */}
			<div className="w-full max-w-2xl z-10">
				<Card className="p-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl">
					<div className="text-center mb-10">
						<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
							Choose your sign in
						</h1>
						<p className="text-slate-600 dark:text-slate-300">
							Select the type of account you want to access.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<Link
							href="/signin/attendee"
							className="group rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50/70 dark:bg-slate-900/20 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-sm">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-md">
									<User className="w-6 h-6" />
								</div>
								<div>
									<h2 className="text-lg font-semibold text-slate-900 dark:text-white">
										Attendee
									</h2>
									<p className="text-sm text-slate-600 dark:text-slate-400">
										Sign in to your attendee dashboard
									</p>
								</div>
							</div>
						</Link>
						<Link
							href="/signin/mhp"
							className="group rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50/70 dark:bg-slate-900/20 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-sm">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-fuchsia-600 to-purple-500 text-white flex items-center justify-center shadow-md">
									<Stethoscope className="w-6 h-6" />
								</div>
								<div>
									<h2 className="text-lg font-semibold text-slate-900 dark:text-white">
										Mental Health Professional
									</h2>
									<p className="text-sm text-slate-600 dark:text-slate-400">
										Sign in to your professional dashboard
									</p>
								</div>
							</div>
						</Link>
					</div>

					<div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
						Need an account?{" "}
						<Link
							href="/signup"
							className="text-indigo-600 dark:text-indigo-400 hover:underline">
							Sign up
						</Link>
					</div>
				</Card>
			</div>
		</div>
	);
}
