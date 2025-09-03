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
	// Local UI state
	const [credentials, setCredentials] = useState({ email: "", password: "" });
	const [errorMessage, setErrorMessage] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [statusMessage, setStatusMessage] = useState("");
	const [hasError, setHasError] = useState(false);
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	// Small helpers to keep JSX tidy (no behavior change)
	const apiBase = process.env.NEXT_PUBLIC_API_URL;
	const inputIconClass =
		"absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400";
	const eyeToggleClass =
		"absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200";
	const submitButtonClass =
		"w-full bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg btn-hover-lift transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-12";

	const handleInputChange = (event) => {
		setCredentials({ ...credentials, [event.target.name]: event.target.value });
		if (errorMessage) setErrorMessage("");
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage("");
		setLoading(true);

		try {
			const response = await fetch(`${apiBase}/api/mhps/signin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(credentials),
			});

			if (!response.ok) {
				const payload = await response.json().catch(() => ({}));
				throw new Error(payload.message || "Invalid credentials");
			}

			const payload = await response.json();
			localStorage.setItem("userType", "mhp");
			localStorage.setItem("token", payload.token);
			localStorage.setItem("userId", payload.userId);
			localStorage.setItem("userName", payload.userName);
			localStorage.setItem("email", payload.email);

			const accountStatus = payload.status;
			if (accountStatus === "pending") {
				setStatusMessage("You can't sign in now. Wait for MHA Approval!");
				setHasError(true);
				setModalOpen(true);
			} else if (accountStatus === "rejected") {
				setStatusMessage("Your registration has been rejected!");
				setHasError(true);
				setModalOpen(true);
			} else if (accountStatus === "approved") {
				router.push(`/dashboard/mhp/${payload.userName}`);
			} else {
				setStatusMessage("Unknown account status");
				setHasError(true);
				setModalOpen(true);
			}
		} catch (errorObj) {
			setErrorMessage(
				errorObj.message || "Something went wrong. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	// Motion variants
	const containerMotion = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
		},
	};
	const itemMotion = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};
	const modalMotion = {
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
		<div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 overflow-x-hidden">
			{/* Background orbs */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
			</div>

			{/* Brand */}
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

			{/* Theme toggle */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="absolute top-6 right-6 z-10">
				<ThemeToggle />
			</motion.div>

			{/* Sign-in card */}
			<motion.div
				variants={containerMotion}
				initial="hidden"
				animate="visible"
				className="w-full max-w-md z-10">
				<motion.div variants={itemMotion}>
					<Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl">
						<motion.div variants={itemMotion} className="text-center mb-8">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
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
							{errorMessage && (
								<motion.div
									initial={{ opacity: 0, y: -10, height: 0 }}
									animate={{ opacity: 1, y: 0, height: "auto" }}
									exit={{ opacity: 0, y: -10, height: 0 }}
									transition={{ duration: 0.3 }}
									className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
									<AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
									<p className="text-red-700 dark:text-red-300 text-sm">
										{errorMessage}
									</p>
								</motion.div>
							)}
						</AnimatePresence>

						<form onSubmit={handleFormSubmit} className="space-y-6">
							<motion.div variants={itemMotion}>
								<Label
									htmlFor="email"
									className="text-slate-700 dark:text-slate-300 font-medium">
									Email Address
								</Label>
								<div className="relative mt-2">
									<Mail className={inputIconClass} />
									<Input
										id="email"
										name="email"
										type="email"
										value={credentials.email}
										onChange={handleInputChange}
										placeholder="Enter your email"
										className="pl-10 h-12 border-2 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
										required
									/>
								</div>
							</motion.div>

							<motion.div variants={itemMotion}>
								<Label
									htmlFor="password"
									className="text-slate-700 dark:text-slate-300 font-medium">
									Password
								</Label>
								<div className="relative mt-2">
									<Lock className={inputIconClass} />
									<Input
										id="password"
										name="password"
										type={isPasswordVisible ? "text" : "password"}
										value={credentials.password}
										onChange={handleInputChange}
										placeholder="Enter your password"
										className="pl-10 pr-10 h-12 border-2 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
										required
									/>
									<motion.button
										type="button"
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => setIsPasswordVisible(!isPasswordVisible)}
										className={eyeToggleClass}>
										{isPasswordVisible ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</motion.button>
								</div>
							</motion.div>

							<motion.div variants={itemMotion}>
								<motion.button
									type="submit"
									disabled={loading}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className={submitButtonClass}>
									{loading ? (
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
							variants={itemMotion}
							className="mt-8 text-center space-y-4">
							<div className="flex items-center justify-center space-x-2 text-sm">
								<span className="text-slate-600 dark:text-slate-400">
									Forgot your password?
								</span>
								<Link
									href="/forgot-password"
									className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
									Reset Password
								</Link>
							</div>
						</motion.div>
					</Card>
				</motion.div>
			</motion.div>

			{/* Status modal */}
			<AnimatePresence>
				{modalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
						onClick={() => setModalOpen(false)}>
						<motion.div
							variants={modalMotion}
							initial="hidden"
							animate="visible"
							exit="exit"
							onClick={(event) => event.stopPropagation()}
							className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
							<div className="flex items-center space-x-4 mb-6">
								<div
									className={`w-12 h-12 rounded-full flex items-center justify-center ${
										hasError
											? "bg-red-100 dark:bg-red-900/20"
											: "bg-green-100 dark:bg-green-900/20"
									}`}>
									{hasError ? (
										<AlertCircle className="w-6 h-6 text-red-500" />
									) : (
										<CheckCircle className="w-6 h-6 text-green-500" />
									)}
								</div>
								<div>
									<h3
										className={`text-lg font-semibold ${
											hasError
												? "text-red-900 dark:text-red-100"
												: "text-green-900 dark:text-green-100"
										}`}>
										{hasError ? "Error" : "Success"}
									</h3>
									<p
										className={`text-sm ${
											hasError
												? "text-red-600 dark:text-red-300"
												: "text-green-600 dark:text-green-300"
										}`}>
										{statusMessage}
									</p>
								</div>
							</div>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setModalOpen(false)}
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
