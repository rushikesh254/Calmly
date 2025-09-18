"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AttendeeSignup() {
	const router = useRouter();

	// State to hold the form data (username, email, password)
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// State to hold any error messages
	const [errorMessage, setErrorMessage] = useState("");
	// State to know if we are currently submitting the form
	const [isSubmitting, setIsSubmitting] = useState(false);
	// State to show a success message
	const [isSuccess, setIsSuccess] = useState(false);

	// This function is called when the user types in the username field
	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
		if (errorMessage) setErrorMessage("");
	};

	// This function is called when the user types in the email field
	const handleEmailChange = (e) => {
		setEmail(e.target.value);
		if (errorMessage) setErrorMessage("");
	};

	// This function is called when the user types in the password field
	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		if (errorMessage) setErrorMessage("");
	};

	// This function is called when the user clicks the submit button
	const handleFormSubmit = async (e) => {
		e.preventDefault(); // Prevent the default form submission
		setIsSubmitting(true); // Let the UI know we are busy

		try {
			// The data we want to send to the server
			const formData = {
				username: username,
				email: email,
				password: password,
			};

			// Send the form data to our API endpoint
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup/attendee`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				}
			);

			const result = await response.json();

			// If the server response is not "ok" (e.g., status 400 or 500), it's an error
			if (!response.ok) {
				throw new Error(
					result.message || "Something went wrong with the signup."
				);
			}

			// If signup was successful
			setIsSuccess(true);
			// Wait a moment to show the success message, then redirect to the signin page
			setTimeout(() => {
				router.push("/signin");
			}, 1500);
		} catch (err) {
			// If an error happened, store the error message to show it to the user
			setErrorMessage(err.message);
			setIsSuccess(false);
		} finally {
			// Whether it succeeded or failed, we are no longer submitting
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-x-hidden">
			<header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60">
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-20">
						<Link href="/" className="group">
							<h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-700 group-hover:to-teal-600">
								Calmly
							</h1>
						</Link>
						<ThemeToggle />
					</div>
				</nav>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="flex items-center justify-center min-h-[calc(100vh-160px)] supports-[height:100dvh]:min-h-[calc(100dvh-160px)]">
					<Card className="w-full max-w-md p-8 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
						<div className="space-y-6">
							<div className="text-center space-y-2">
								<h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
									Attendee Sign Up
								</h2>
								<p className="text-slate-600 dark:text-slate-400">
									Start your wellness journey with us
								</p>
							</div>

							{errorMessage && (
								<div
									className="py-3 px-4 text-sm border border-red-400/50 bg-red-500/10 dark:bg-red-950/30 dark:border-red-900/40 text-red-700 dark:text-red-300 rounded-lg"
									role="alert"
									aria-live="polite">
									{errorMessage}
								</div>
							)}

							<form
								onSubmit={handleFormSubmit}
								className="space-y-6"
								noValidate>
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
											value={username}
											onChange={handleUsernameChange}
											className="bg-white/50 dark:bg-slate-800/60 focus:bg-white/70 dark:focus:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/40 shadow-sm focus:shadow-indigo-100 transition-all"
											required
											aria-required="true"
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
											value={email}
											onChange={handleEmailChange}
											className="bg-white/50 dark:bg-slate-800/60 focus:bg-white/70 dark:focus:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/40 shadow-sm focus:shadow-indigo-100 transition-all"
											required
											aria-required="true"
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
											value={password}
											onChange={handlePasswordChange}
											className="bg-white/50 dark:bg-slate-800/60 focus:bg-white/70 dark:focus:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/40 shadow-sm focus:shadow-indigo-100 transition-all"
											required
											aria-required="true"
										/>
									</div>
								</div>

								<Button
									type="submit"
									className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white hover:from-indigo-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-indigo-200/40"
									disabled={isSubmitting || isSuccess}
									aria-busy={isSubmitting}
									aria-live="polite">
									{isSuccess
										? "Account Created! 🎉"
										: isSubmitting
											? "Creating Account..."
											: "Sign Up"}
								</Button>
							</form>

							<div className="space-y-4">
								<p className="text-center text-sm text-slate-600 dark:text-slate-400">
									Already have an account?{" "}
									<Link
										href="/signin"
										className="text-indigo-600 dark:text-indigo-400 hover:underline">
										Sign in
									</Link>
								</p>

								<p className="text-center text-sm text-slate-600 dark:text-slate-400">
									Are you a Mental Health Professional?{" "}
									<Link
										href="/signup/mhp"
										className="text-teal-600 dark:text-teal-400 hover:underline">
										Register here
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
