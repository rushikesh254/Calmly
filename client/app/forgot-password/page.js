"use client"; // Multi-step password recovery (request + OTP verify)
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ForgotPassword() {
	const [role, setRole] = useState("");
	const [email, setEmail] = useState("");
	const [step, setStep] = useState(1); // 1: request form, 2: OTP verify
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	const submitRequest = async (e) => {
		e.preventDefault();
		setError("");
		if (!role || !email) {
			setError("Please fill all fields");
			return;
		}
		setSubmitting(true);
		const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || (typeof window !== "undefined" ? window.location.origin : "");
		try {
			const res = await fetch(`${base}/api/forgot/forgot-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ role, email }),
			});
			const json = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json.error || json.message || "Request failed. Please try again.");
			localStorage.setItem("otp", json.otp);
			localStorage.setItem("email", email);
			localStorage.setItem("role", role);
			setStep(2);
		} catch (err) {
			setError(err.message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
	<div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-x-hidden">
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
						</div>
					</div>
				</nav>
			</header>

	<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="flex items-center justify-center min-h-[calc(100vh-160px)] supports-[height:100dvh]:min-h-[calc(100dvh-160px)]">
		  <Card className="w-full max-w-md p-8 bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
			{step === 1 ? (
							<div className="space-y-6">
								<div className="text-center space-y-2">
									<h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
										Forgot Password
									</h2>
									<p className="text-slate-600 dark:text-slate-300">
										Enter your details to reset password
									</p>
								</div>

					<form onSubmit={submitRequest} className="space-y-6" noValidate>
									<div className="space-y-4">
										<div className="space-y-2">
											<Label
												htmlFor="role"
												className="text-slate-700 dark:text-slate-300">
												Select Role
											</Label>
							<select value={role} onChange={(e) => setRole(e.target.value)} className="flex h-10 w-full rounded-md border text-slate-700 dark:text-slate-200 border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50" required aria-label="Select role">
												<option value="">Select Role</option>
												<option value="attendee">Attendee</option>
												<option value="mhp">Mental Health Professional</option>
											</select>
										</div>

										<div className="space-y-2">
											<Label
												htmlFor="email"
												className="text-slate-700 dark:text-slate-300">
												Email
											</Label>
						<Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 focus:bg-white/70 dark:focus:bg-slate-900/60 border-slate-200/60 dark:border-slate-700/60 focus:ring-2 focus:ring-indigo-500/50" required aria-required="true" />
										</div>
									</div>

				  <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white hover:from-indigo-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-indigo-200/40" disabled={submitting} aria-busy={submitting}>{submitting ? "Sending..." : "Continue"}</Button>
								</form>

				{error && (<p className="text-center text-sm text-red-600 dark:text-red-400" role="alert" aria-live="polite">{error}</p>)}
				<p className="text-center text-sm text-slate-600 dark:text-slate-300">
									Remember your password?{" "}
									<Link
										href="/signin"
										className="text-indigo-600 dark:text-indigo-400 hover:underline">
										Sign in
									</Link>
								</p>
							</div>
						) : (
							<OTPVerification />
						)}
		  </Card>
				</div>
	</main>

	<footer className="border-t border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="text-center text-slate-500 dark:text-slate-400 text-sm">
						© 2025 Calmly. Compassion in every connection.
					</div>
				</div>
			</footer>
		</div>
	);
}

function OTPVerification() {
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	const verify = (e) => {
		e.preventDefault();
		const stored = localStorage.getItem("otp");
		if (otp !== stored) {
			setError("Invalid code");
			return;
		}
		router.push("/reset-password");
	};
	return (
		<div className="space-y-6">
			<div className="text-center space-y-2">
				<h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">OTP Verification</h2>
				<p className="text-slate-600 dark:text-slate-300">Check your email for verification code</p>
			</div>
			<form onSubmit={verify} className="space-y-6" noValidate>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="otp" className="text-slate-700 dark:text-slate-300">Enter OTP</Label>
						<Input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => { setOtp(e.target.value); if (error) setError(""); }} className="bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 focus:bg-white/70 dark:focus:bg-slate-900/60 border-slate-200/60 dark:border-slate-700/60 focus:ring-2 focus:ring-indigo-500/50" required aria-required="true" />
					</div>
				</div>
				{error && (<p className="text-center text-sm text-red-600 dark:text-red-400" role="alert" aria-live="polite">{error}</p>)}
				<Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white hover:from-indigo-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-indigo-200/40">Verify OTP</Button>
			</form>
		</div>
	);
}
