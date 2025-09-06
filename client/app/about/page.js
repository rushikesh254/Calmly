// About page: mission, team, values, CTA.
import Link from "next/link";
import { Heart, Users, Target, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function About() {
	return (
		<div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			
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
									className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">
									About
								</Link>
								<Link
									href="/contact"
									className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
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

			
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center mb-16">
					<div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
						<Heart className="w-10 h-10 text-white" />
					</div>
					<h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
						About{" "}
						<span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
							Calmly
						</span>
					</h2>
					<p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
						Revolutionizing mental health support through technology and
						compassion
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-12 mb-16">
					<Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-200/80 dark:hover:border-indigo-600/80 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
						<div className="flex items-center space-x-3 mb-4">
							<div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
								<Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
							</div>
							<h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
								Our Mission
							</h3>
						</div>
						<p className="text-slate-600 dark:text-slate-300 leading-relaxed">
							At Calmly, we believe everyone deserves accessible mental health
							support. Our platform bridges the gap between professional care
							and immediate needs, offering a holistic approach to mental
							wellness through innovative technology and human-centered design.
						</p>
					</Card>

					<Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-200/80 dark:hover:border-indigo-600/80 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
						<div className="flex items-center space-x-3 mb-4">
							<div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center">
								<Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />
							</div>
							<h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
								Our Team
							</h3>
						</div>
						<p className="text-slate-600 dark:text-slate-300 leading-relaxed">
							A diverse team of mental health professionals, technologists, and
							designers working together to create meaningful solutions. We
							combine clinical expertise with cutting-edge AI to deliver
							personalized support when you need it most.
						</p>
					</Card>
				</div>

				
				<div className="mb-16">
					<h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
						Our Core Values
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200/60 dark:border-indigo-700/60 text-center">
							<div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
								<Heart className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
							</div>
							<h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
								Compassion
							</h4>
							<p className="text-slate-600 dark:text-slate-300">
								Every interaction is guided by empathy and understanding
							</p>
						</Card>

						<Card className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200/60 dark:border-teal-700/60 text-center">
							<div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
								<Award className="w-8 h-8 text-teal-600 dark:text-teal-400" />
							</div>
							<h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
								Excellence
							</h4>
							<p className="text-slate-600 dark:text-slate-300">
								Committed to delivering the highest quality mental health
								support
							</p>
						</Card>

						<Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/60 dark:border-purple-700/60 text-center">
							<div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
								<Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
							</div>
							<h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
								Innovation
							</h4>
							<p className="text-slate-600 dark:text-slate-300">
								Leveraging technology to make mental health care accessible to
								all
							</p>
						</Card>
					</div>
				</div>

				<div className="text-center">
					<Button
						size="lg"
						className="bg-gradient-to-r from-indigo-600 to-teal-500 text-white hover:from-indigo-700 hover:to-teal-600 px-8 py-4 text-lg"
						asChild>
						<Link href="/contact" className="flex items-center">
							Get in Touch
							<ArrowRight className="ml-2 w-5 h-5" />
						</Link>
					</Button>
				</div>
			</main>

			
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
