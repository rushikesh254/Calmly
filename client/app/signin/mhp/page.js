"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import {
	Heart,
	Eye,
	EyeOff,
	Lock,
	Mail,
	AlertCircle,
	CheckCircle,
	Shield,
} from "lucide-react";
import Link from "next/link";

export default function MHPSignInPage() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState("");
	const [isError, setIsError] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		if (error) setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/mhps/signin`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				}
			);

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message || "Invalid credentials");
			}

			const data = await res.json();
			localStorage.setItem("userType", "mhp");
			localStorage.setItem("token", data.token);
			localStorage.setItem("userId", data.userId);
			localStorage.setItem("userName", data.userName);
			localStorage.setItem("email", data.email);

			const status = data.status;
			if (status === "pending") {
				setModalMessage("You can't sign in now. Wait for MHA Approval!");
				setIsError(true);
				setIsModalOpen(true);
			} else if (status === "rejected") {
				setModalMessage("Your registration has been rejected!");
				setIsError(true);
				setIsModalOpen(true);
			} else if (status === "approved") {
				router.push(`/dashboard/mhp/${data.userName}`);
			} else {
				setModalMessage("Unknown account status");
				setIsError(true);
				setIsModalOpen(true);
			}
		} catch (err) {
			setError(err.message || "Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
		},
	};
	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};
	const modalVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.3, ease: "easeOut" },
		},
		exit: {
			opacity: 0,
			scale: 0.8,
			transition: { duration: 0.2, ease: "easeIn" },
		},
	};

	return (
		<div className="min-h-dvh bg-gradient-to-br from-slate-50 via-purple-50 to-fuchsia-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 overflow-x-hidden">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-fuchsia-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="absolute top-6 left-6 z-10">
				<Link href="/" className="flex items-center space-x-3 group">
					<motion.div
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
						className="w-10 h-10 bg-gradient-to-r from-fuchsia-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
						<Heart className="w-6 h-6 text-white" />
					</motion.div>
					<span className="text-2xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
						Calmly
					</span>
				</Link>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="absolute top-6 right-6 z-10">
				<ThemeToggle />
			</motion.div>

			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="w-full max-w-md z-10">
				<motion.div variants={itemVariants}>
					<Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl">
						<motion.div variants={itemVariants} className="text-center mb-8">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="w-16 h-16 bg-gradient-to-r from-fuchsia-600 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
								<Shield className="w-8 h-8 text-white" />
							</motion.div>
							<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
								Professional Sign In
							</h1>
							<p className="text-slate-600 dark:text-slate-300">
								Access your MHP dashboard and manage your clients
							</p>
						</motion.div>

						<AnimatePresence>
							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10, height: 0 }}
									animate={{ opacity: 1, y: 0, height: "auto" }}
									exit={{ opacity: 0, y: -10, height: 0 }}
									transition={{ duration: 0.3 }}
									className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
									<AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
									<p className="text-red-700 dark:text-red-300 text-sm">
										{error}
									</p>
								</motion.div>
							)}
						</AnimatePresence>

						<form onSubmit={handleSubmit} className="space-y-6">
							<motion.div variants={itemVariants}>
								<Label
									htmlFor="email"
									className="text-slate-700 dark:text-slate-300 font-medium">
									Email Address
								</Label>
								<div className="relative mt-2">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
									<Input
										id="email"
										name="email"
										type="email"
										value={formData.email}
										onChange={handleChange}
										placeholder="Enter your email"
										className="pl-10 h-12 border-2 focus:border-fuchsia-500 focus:ring-fuchsia-500 transition-colors duration-200"
										required
									/>
								</div>
							</motion.div>

							<motion.div variants={itemVariants}>
								<Label
									htmlFor="password"
									className="text-slate-700 dark:text-slate-300 font-medium">
									Password
								</Label>
								<div className="relative mt-2">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
									<Input
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										value={formData.password}
										onChange={handleChange}
										placeholder="Enter your password"
										className="pl-10 pr-10 h-12 border-2 focus:border-fuchsia-500 focus:ring-fuchsia-500 transition-colors duration-200"
										required
									/>
									<motion.button
										type="button"
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200">
										{showPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</motion.button>
								</div>
							</motion.div>

							<motion.div variants={itemVariants}>
								<motion.button
									type="submit"
									disabled={isLoading}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-500 hover:from-fuchsia-700 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg btn-hover-lift transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-12">
									{isLoading ? (
										<div className="flex items-center justify-center space-x-2">
											<div className="spinner"></div>
											<span>Signing In...</span>
										</div>
									) : (
										"Sign In"
									)}
								</motion.button>
							</motion.div>
						</form>

						<motion.div
							variants={itemVariants}
							className="mt-8 text-center space-y-4">
							<div className="flex items-center justify-center space-x-2 text-sm">
								<span className="text-slate-600 dark:text-slate-400">
									Forgot your password?
								</span>
								<Link
									href="/forgot-password"
									className="text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 dark:hover:text-fuchsia-300 font-medium transition-colors">
									Reset Password
								</Link>
							</div>
						</motion.div>
					</Card>
				</motion.div>
			</motion.div>

			<AnimatePresence>
				{isModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
						onClick={() => setIsModalOpen(false)}>
						<motion.div
							variants={modalVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							onClick={(e) => e.stopPropagation()}
							className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
							<div className="flex items-center space-x-4 mb-6">
								<div
									className={`w-12 h-12 rounded-full flex items-center justify-center ${isError ? "bg-red-100 dark:bg-red-900/20" : "bg-green-100 dark:bg-green-900/20"}`}>
									{isError ? (
										<AlertCircle className="w-6 h-6 text-red-500" />
									) : (
										<CheckCircle className="w-6 h-6 text-green-500" />
									)}
								</div>
								<div>
									<h3
										className={`text-lg font-semibold ${isError ? "text-red-900 dark:text-red-100" : "text-green-900 dark:text-green-100"}`}>
										{isError ? "Error" : "Success"}
									</h3>
									<p
										className={`text-sm ${isError ? "text-red-600 dark:text-red-300" : "text-green-600 dark:text-green-300"}`}>
										{modalMessage}
									</p>
								</div>
							</div>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setIsModalOpen(false)}
								className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
								Close
							</motion.button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
