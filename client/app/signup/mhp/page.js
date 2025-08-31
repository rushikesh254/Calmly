"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";

export default function MHPSignup() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		username: "",
		licenseNumber: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Close menu on Escape and lock body scroll when open
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") setIsMenuOpen(false);
		};
		document.addEventListener("keydown", onKey);
		if (isMenuOpen) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.classList.remove("overflow-hidden");
		};
	}, [isMenuOpen]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		if (error) setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup/mhp`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...formData,
						// send legacy field too for backward compatibility server side (will be ignored if not needed)
						bmdcRegNo: formData.licenseNumber,
					}),
				}
			);
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Registration failed");

			setIsSuccess(true);
			setModalMessage("Wait for the approval");
			setIsModalOpen(true);
			setTimeout(() => {
				router.push("/signin");
			}, 2500);
		} catch (err) {
			setError(err.message);
			setIsSuccess(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-x-hidden">
			{/* Approval Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="p-6 rounded-lg shadow-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/40">
						<p className="text-center mb-4 text-green-600 dark:text-green-300">
							{modalMessage}
						</p>
						{/* <Button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Close
            </Button> */}
					</div>
				</div>
			)}

			{/* Header */}
			<header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60">
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-20">
						<Link href="/" className="group">
							<h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-700 group-hover:to-teal-600">
								Calmly
							</h1>
						</Link>
						<div className="flex items-center gap-2">
							<ThemeToggle />
							<button
								aria-label="Open menu"
								className="inline-flex items-center justify-center p-2 rounded-md border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/70 hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-sm md:hidden"
								onClick={() => setIsMenuOpen(true)}>
								<Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
							</button>
						</div>
					</div>
				</nav>
			</header>

			{/* Mobile Menu Drawer */}
			{isMenuOpen && (
				<div className="fixed inset-0 z-[60]">
					{/* overlay */}
					<button
						aria-label="Close menu"
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={() => setIsMenuOpen(false)}
					/>
					{/* panel */}
					<div className="absolute right-0 top-0 h-full w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-slate-200/60 dark:border-slate-700/60 shadow-2xl p-6 flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<span className="text-lg font-semibold text-slate-700 dark:text-slate-200">
								Menu
							</span>
							<button
								aria-label="Close"
								className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
								onClick={() => setIsMenuOpen(false)}>
								<X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
							</button>
						</div>
						<nav className="flex flex-col gap-2 text-slate-700 dark:text-slate-300">
							<Link
								href="/"
								className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
								onClick={() => setIsMenuOpen(false)}>
								Home
							</Link>
							<Link
								href="/about"
								className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
								onClick={() => setIsMenuOpen(false)}>
								About
							</Link>
							<Link
								href="/contact"
								className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
								onClick={() => setIsMenuOpen(false)}>
								Contact
							</Link>
							<Link
								href="/signin"
								className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
								onClick={() => setIsMenuOpen(false)}>
								Sign in
							</Link>
							<Link
								href="/signup/attendee"
								className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
								onClick={() => setIsMenuOpen(false)}>
								Attendee Sign Up
							</Link>
							<span className="px-3 py-2 rounded-md bg-slate-100/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 cursor-default">
								Professional Sign Up
							</span>
						</nav>
					</div>
				</div>
			)}

			{/* Rest of the component remains exactly the same */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="flex items-center justify-center min-h-[calc(100vh-160px)] supports-[height:100dvh]:min-h-[calc(100dvh-160px)]">
					<Card className="w-full max-w-md p-8 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
						<div className="space-y-6">
							<div className="text-center space-y-2">
								<h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
									Professional Sign Up
								</h2>
								<p className="text-slate-600 dark:text-slate-400">
									Join our network of mental health experts
								</p>
							</div>

							{error && (
								<div className="py-3 px-4 text-sm border border-red-400/50 bg-red-500/10 dark:bg-red-950/30 dark:border-red-900/40 text-red-700 dark:text-red-300 rounded-lg">
									{error}
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-4">
									<div className="space-y-2">
										<Label
											htmlFor="username"
											className="text-slate-700 dark:text-slate-300">
											Username
										</Label>
										<Input
											type="text"
											name="username"
											onChange={handleChange}
											required
											className="bg-white/50 dark:bg-slate-800/60 focus:bg-white/70 dark:focus:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/40 shadow-sm focus:shadow-indigo-100 transition-all"
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="licenseNumber"
											className="text-slate-700 dark:text-slate-300">
											License Number
										</Label>
										<Input
											type="text"
											name="licenseNumber"
											onChange={handleChange}
											required
											className="bg-white/50 dark:bg-slate-800/60 focus:bg-white/70 dark:focus:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/40 shadow-sm focus:shadow-indigo-100 transition-all"
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="email"
											className="text-slate-700 dark:text-slate-300">
											Email
										</Label>
										<Input
											type="email"
											name="email"
											onChange={handleChange}
											required
											className="bg-white/50 dark:bg-slate-800/60 focus:bg-white/70 dark:focus:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/40 shadow-sm focus:shadow-indigo-100 transition-all"
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="password"
											className="text-slate-700 dark:text-slate-300">
											Password
										</Label>
										<Input
											type="password"
											name="password"
											onChange={handleChange}
											required
											className="bg-white/50 dark:bg-slate-800/60 focus:bg-white/70 dark:focus:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/40 shadow-sm focus:shadow-indigo-100 transition-all"
										/>
									</div>
								</div>

								<Button
									type="submit"
									className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white hover:from-indigo-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-indigo-200/40"
									disabled={isSubmitting || isSuccess}>
									{isSuccess
										? "Account Created! 🎉"
										: isSubmitting
										? "Registering..."
										: "Sign Up"}
								</Button>
							</form>

							<div className="space-y-4">
								<p className="text-center text-sm text-slate-600 dark:text-slate-400">
									Already registered?{" "}
									<Link
										href="/signin"
										className="text-indigo-600 dark:text-indigo-400 hover:underline">
										Sign in
									</Link>
								</p>
								<p className="text-center text-sm text-slate-600 dark:text-slate-400">
									Are you an Attendee?{" "}
									<Link
										href="/signup/attendee"
										className="text-teal-600 dark:text-teal-400 hover:underline">
										Sign up here
									</Link>
								</p>
							</div>
						</div>
					</Card>
				</div>
			</main>

			<footer className="border-t border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="text-center text-slate-500 dark:text-slate-400 text-sm">
						© 2025 Calmly. Compassion in every connection.
					</div>
				</div>
			</footer>
		</div>
	);
}
