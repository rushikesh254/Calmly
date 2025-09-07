"use client"; // Animations + interactive theme toggle.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { Heart, Users, Shield, Clock, MessageCircle, TrendingUp, ArrowRight, Star, Sparkles } from "lucide-react";

export default function HomePage() {
	// Static marketing data (unchanged content).
	const features = [
		{ icon: <Heart className="w-8 h-8" />, title: "Professional Therapy", description: "Connect with licensed mental health professionals for personalized support and guidance.", color: "text-red-500" },
		{ icon: <Shield className="w-8 h-8" />, title: "Secure & Private", description: "Your mental health journey is protected with end-to-end encryption and strict privacy policies.", color: "text-blue-500" },
		{ icon: <Clock className="w-8 h-8" />, title: "24/7 Support", description: "Access resources, track your mood, and get support whenever you need it, day or night.", color: "text-green-500" },
		{ icon: <MessageCircle className="w-8 h-8" />, title: "AI Chatbot", description: "Get instant support and guidance from our intelligent mental health assistant.", color: "text-purple-500" },
		{ icon: <TrendingUp className="w-8 h-8" />, title: "Mood Tracking", description: "Monitor your emotional well-being with our comprehensive mood tracking tools.", color: "text-orange-500" },
		{ icon: <Users className="w-8 h-8" />, title: "Community Support", description: "Join a supportive community of individuals on similar mental health journeys.", color: "text-indigo-500" }
	];

	const testimonials = [
		{ name: "Sarah Johnson", role: "Student", content: "Calmly has been a game-changer for my mental health. The mood tracking feature helps me understand my patterns better.", rating: 5 },
		{ name: "Michael Chen", role: "Professional", content: "The professional therapy sessions are incredibly helpful. I feel supported and understood.", rating: 5 },
		{ name: "Emily Rodriguez", role: "Parent", content: "As a busy parent, having 24/7 access to mental health resources has been invaluable.", rating: 5 }
	];

	// Framer Motion variants.
	const staggeredContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
	const cardVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
		hover: { y: -8, transition: { duration: 0.3, ease: "easeOut" } }
	};

	return (
		<div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-x-hidden">
			
			<motion.nav
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="relative z-50 px-6 py-6">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<motion.div
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}>
						<Link href="/" className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
								<Heart className="w-6 h-6 text-white" />
							</div>
							<span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
								Calmly
							</span>
						</Link>
					</motion.div>
					<div className="hidden md:flex items-center space-x-6">
						<motion.div whileHover={{ scale: 1.05 }}>
							<Link
								href="/about"
								className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium">
								About
							</Link>
						</motion.div>
						<motion.div whileHover={{ scale: 1.05 }}>
							<Link
								href="/contact"
								className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium">
								Contact
							</Link>
						</motion.div>
						<ThemeToggle />
						<motion.div whileHover={{ scale: 1.05 }}>
							<Link href="/signin">
								<Button variant="ghost" className="font-medium">
									Sign In
								</Button>
							</Link>
						</motion.div>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Link href="/signup">
								<Button className="bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 shadow-lg btn-hover-lift">
									Get Started
								</Button>
							</Link>
						</motion.div>
					</div>
				</div>
			</motion.nav>

			
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				className="relative px-6 py-24">
				<div className="max-w-7xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="mb-12">
						<div className="flex items-center justify-center mb-6">
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
								className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl mr-4">
								<Sparkles className="w-8 h-8 text-white" />
							</motion.div>
						</div>
						<h1 className="text-6xl md:text-8xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
							Your Mental Health
							<span className="block bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
								Matters
							</span>
						</h1>
						<p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
							Compassion in every connection. Professional therapy, mood
							tracking, and 24/7 support to help you thrive on your mental
							health journey.
						</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="flex flex-col sm:flex-row gap-6 justify-center items-center">
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Link href="/signup">
								<Button
									size="lg"
									className="bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 text-lg px-10 py-6 shadow-xl btn-hover-lift">
									Start Your Journey
									<ArrowRight className="ml-3 w-6 h-6" />
								</Button>
							</Link>
						</motion.div>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Link href="/about">
								<Button
									variant="outline"
									size="lg"
									className="text-lg px-10 py-6 border-2 font-medium">
									Learn More
								</Button>
							</Link>
						</motion.div>
					</motion.div>
				</div>
			</motion.section>

			
			<motion.section
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
				className="px-6 py-24 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="text-center mb-20">
						<h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8">
							Everything You Need for
							<span className="block bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
								Mental Wellness
							</span>
						</h2>
						<p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
							Comprehensive tools and support to help you understand, track, and
							improve your mental health.
						</p>
					</motion.div>
					<motion.div
						variants={staggeredContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((featureItem, index) => (
							<motion.div
								key={index}
								variants={cardVariants}
								whileHover="hover"
								className="group">
								<Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl card-hover h-full">
									<motion.div
										className={`${featureItem.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
										{featureItem.icon}
									</motion.div>
									<h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
										{featureItem.title}
									</h3>
									<p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
										{featureItem.description}
									</p>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</motion.section>

			
			<motion.section
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
				className="px-6 py-24">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="text-center mb-20">
						<h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8">
							Trusted by Thousands
						</h2>
						<p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
							Join our community of individuals who have transformed their
							mental health journey with Calmly.
						</p>
					</motion.div>
					<motion.div
						variants={staggeredContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{testimonials.map((testimonialItem, index) => (
							<motion.div
								key={index}
								variants={cardVariants}
								whileHover="hover"
								className="group">
								<Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl card-hover h-full">
									<div className="flex items-center mb-6">
										{[...Array(testimonialItem.rating)].map((_, i) => (
											<Star
												key={i}
												className="w-5 h-5 text-yellow-400 fill-current"
											/>
										))}
									</div>
									<p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6">
										&ldquo;{testimonialItem.content}&rdquo;
									</p>
									<div>
										<p className="font-semibold text-slate-900 dark:text-white">
											{testimonialItem.name}
										</p>
										<p className="text-slate-500 dark:text-slate-400">
											{testimonialItem.role}
										</p>
									</div>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</motion.section>

			
			<motion.section
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
				className="px-6 py-24 bg-gradient-to-r from-indigo-600 to-teal-500">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}>
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
							Ready to Start Your Journey?
						</h2>
						<p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
							Join thousands of individuals who have transformed their mental
							health with Calmly. Take the first step today.
						</p>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Link href="/signup">
								<Button
									size="lg"
									className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-10 py-6 shadow-xl btn-hover-lift font-semibold">
									Get Started Now
									<ArrowRight className="ml-3 w-6 h-6" />
								</Button>
							</Link>
						</motion.div>
					</motion.div>
				</div>
			</motion.section>

			
			<motion.footer
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
				className="px-6 py-12 bg-slate-900 text-white">
				<div className="max-w-7xl mx-auto text-center">
					<div className="flex items-center justify-center mb-6">
						<div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-lg flex items-center justify-center mr-3">
							<Heart className="w-5 h-5 text-white" />
						</div>
						<span className="text-2xl font-bold">Calmly</span>
					</div>
					<p className="text-slate-400 mb-6">
						Compassion in every connection. Your mental health matters.
					</p>
					<div className="flex justify-center space-x-6 text-sm text-slate-400">
						<Link
							href="/about"
							className="hover:text-white transition-colors duration-200">
							About
						</Link>
						<Link
							href="/contact"
							className="hover:text-white transition-colors duration-200">
							Contact
						</Link>
						<Link
							href="/signin"
							className="hover:text-white transition-colors duration-200">
							Sign In
						</Link>
					</div>
				</div>
			</motion.footer>
		</div>
	);
}
