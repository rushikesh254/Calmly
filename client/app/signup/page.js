/**
 * Modern Sign Up Page for Calmly Mental Health Platform
 * @author Rushikesh Bodke
 */
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { Heart, Users, UserCheck, ArrowRight } from "lucide-react";

export default function SignUpPage() {
	// Page-wide stagger settings for entrance animations
	const staggeredContainer = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.1,
			},
		},
	};

	// Single-item fade-and-lift motion
	const fadeInUp = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
		hover: {
			y: -8,
			transition: {
				duration: 0.3,
				ease: "easeOut",
			},
		},
	};

	return (
		<div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-x-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
			</div>

			{/* Header */}
			<motion.header
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60">
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-20">
						<motion.div
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2 }}>
							<Link href="/" className="flex items-center space-x-3 group">
								<div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
									<Heart className="w-6 h-6 text-white" />
								</div>
								<span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-700 group-hover:to-teal-600">
									Calmly
								</span>
							</Link>
						</motion.div>
						<ThemeToggle />
					</div>
				</nav>
			</motion.header>

			{/* Main Content */}
			<motion.main
				variants={staggeredContainer}
				initial="hidden"
				animate="visible"
				className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="flex items-center justify-center min-h-[calc(100vh-160px)] supports-[height:100dvh]:min-h-[calc(100dvh-160px)]">
					<motion.div variants={fadeInUp} className="w-full max-w-2xl">
						<Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl card-hover">
							<motion.div variants={fadeInUp} className="space-y-8 text-center">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ duration: 0.5, delay: 0.3 }}
									className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
									<Users className="w-10 h-10 text-white" />
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 0.4 }}>
									<h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-4">
										Join Our Community
									</h2>
									<p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
										Choose your path and start your wellness journey with Calmly
									</p>
								</motion.div>

								<motion.div
									variants={staggeredContainer}
									className="grid grid-cols-1 md:grid-cols-2 gap-8">
									<motion.div
										variants={cardVariants}
										whileHover="hover"
										className="group">
										<Card className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200/60 dark:border-indigo-700/60 shadow-xl card-hover h-full">
											<div className="space-y-6">
												<motion.div
													whileHover={{ scale: 1.1, rotate: 5 }}
													transition={{ duration: 0.3 }}
													className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto">
													<Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
												</motion.div>
												<div>
													<h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
														I&apos;m an Attendee
													</h3>
													<p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
														Looking for mental health support and resources to
														improve your well-being
													</p>
												</div>
												<motion.div
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}>
													<Button
														asChild
														className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600 shadow-lg btn-hover-lift h-12 text-base font-semibold">
														<Link
															href="/signup/attendee"
															className="flex items-center justify-center">
															Get Started
															<ArrowRight className="ml-2 w-5 h-5" />
														</Link>
													</Button>
												</motion.div>
											</div>
										</Card>
									</motion.div>

									<motion.div
										variants={cardVariants}
										whileHover="hover"
										className="group">
										<Card className="p-8 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200/60 dark:border-teal-700/60 shadow-xl card-hover h-full">
											<div className="space-y-6">
												<motion.div
													whileHover={{ scale: 1.1, rotate: -5 }}
													transition={{ duration: 0.3 }}
													className="w-16 h-16 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mx-auto">
													<UserCheck className="w-8 h-8 text-teal-600 dark:text-teal-400" />
												</motion.div>
												<div>
													<h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
														I&apos;m a Professional
													</h3>
													<p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
														Mental health professional providing support and
														guidance to others
													</p>
												</div>
												<motion.div
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}>
													<Button
														asChild
														className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white hover:from-teal-700 hover:to-emerald-600 shadow-lg btn-hover-lift h-12 text-base font-semibold">
														<Link
															href="/signup/mhp"
															className="flex items-center justify-center">
															Join as Professional
															<ArrowRight className="ml-2 w-5 h-5" />
														</Link>
													</Button>
												</motion.div>
											</div>
										</Card>
									</motion.div>
								</motion.div>

								<motion.div variants={fadeInUp} className="relative">
									<div className="absolute inset-0 flex items-center">
										<span className="w-full border-t border-slate-200 dark:border-slate-700" />
									</div>
									<div className="relative flex justify-center text-xs uppercase">
										<span className="bg-white/90 dark:bg-slate-800/90 px-4 text-slate-500 dark:text-slate-400">
											Already have an account?
										</span>
									</div>
								</motion.div>

								<motion.div variants={fadeInUp} className="text-center">
									<Link
										href="/signin"
										className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-200 text-lg">
										Sign in to your account
									</Link>
								</motion.div>
							</motion.div>
						</Card>
					</motion.div>
				</div>
			</motion.main>
		</div>
	);
}
