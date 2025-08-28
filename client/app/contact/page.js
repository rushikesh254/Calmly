/**
 * Modern Contact Page for Calmly Mental Health Platform
 * @author Rushikesh Bodke
 */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	Heart,
	Mail,
	Phone,
	Clock,
	MessageCircle,
	ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
	return (
		<div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			{/* Header */}
			<header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60">
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-20">
						<Link href="/" className="flex items-center space-x-2 group">
							<div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-lg flex items-center justify-center">
								<Heart className="w-5 h-5 text-white" />
							</div>
							<span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-700 group-hover:to-teal-600">
								Calmly
							</span>
						</Link>
						<div className="flex items-center space-x-4">
							<nav className="hidden md:flex items-center space-x-8">
								<Link
									href="/about"
									className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
									About
								</Link>
								<Link
									href="/contact"
									className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">
									Contact
								</Link>
							</nav>
							<ThemeToggle />
							<Button
								asChild
								className="rounded-full px-8 bg-gradient-to-r from-indigo-600 to-teal-500 text-white hover:from-indigo-700 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-indigo-200/40">
								<Link href="/signin">Sign in</Link>
							</Button>
						</div>
					</div>
				</nav>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center mb-16">
					<div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
						<MessageCircle className="w-10 h-10 text-white" />
					</div>
					<h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
						Get in{" "}
						<span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
							Touch
						</span>
					</h2>
					<p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
						We&apos;re here to help! Reach out to us through any of these
						channels
					</p>
				</div>

				{/* Contact Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
					<Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200/60 dark:border-indigo-700/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<div className="text-center space-y-4">
							<div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto">
								<Mail className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
							</div>
							<h3 className="text-xl font-semibold text-slate-900 dark:text-white">
								Email Support
							</h3>
							<p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
								Get in touch via email for general inquiries
							</p>
							<a
								href="mailto:rushikeshbodke884@gmail.com"
								className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
								rushikeshbodke884@gmail.com
							</a>
						</div>
					</Card>

					<Card className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200/60 dark:border-teal-700/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<div className="text-center space-y-4">
							<div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mx-auto">
								<Phone className="w-8 h-8 text-teal-600 dark:text-teal-400" />
							</div>
							<h3 className="text-xl font-semibold text-slate-900 dark:text-white">
								Emergency Support
							</h3>
							<p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
								Available 24/7 for urgent mental health support
							</p>
							<a
								href="tel:+917410726319"
								className="text-teal-600 dark:text-teal-400 hover:underline font-medium">
								+91 7410726319
							</a>
						</div>
					</Card>

					<Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/60 dark:border-purple-700/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<div className="text-center space-y-4">
							<div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto">
								<Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
							</div>
							<h3 className="text-xl font-semibold text-slate-900 dark:text-white">
								Office Hours
							</h3>
							<p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
								Regular business hours for non-urgent inquiries
							</p>
							<p className="text-purple-600 dark:text-purple-400 font-medium">
								Mon-Fri: 9 AM - 7 PM (IST)
							</p>
						</div>
					</Card>
				</div>

				{/* Additional Information */}
				<div className="text-center space-y-6">
					<Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
						<h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
							Need Immediate Help?
						</h3>
						<p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
							If you&apos;re experiencing a mental health crisis or having
							thoughts of self-harm, please contact emergency services
							immediately or reach out to our 24/7 support line.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								asChild
								className="bg-red-600 hover:bg-red-700 text-white">
								<Link href="tel:+917410726319" className="flex items-center">
									<Phone className="w-4 h-4 mr-2" />
									Emergency Support
								</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								className="border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
								<Link href="/signup" className="flex items-center">
									Get Started
									<ArrowRight className="w-4 h-4 ml-2" />
								</Link>
							</Button>
						</div>
					</Card>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md mt-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="text-center text-slate-500 dark:text-slate-400 text-sm">
						© 2025 Calmly. Compassion in every connection. Developed by
						Rushikesh Bodke.
					</div>
				</div>
			</footer>
		</div>
	);
}
