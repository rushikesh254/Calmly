"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
	const [role, setRole] = useState("");
	const [email, setEmail] = useState("");
	const [step, setStep] = useState(1);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!role || !email) return alert("Please fill all fields");

		// Determine API base URL: prefer env, fallback to current origin
		const apiBase =
			process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
			(typeof window !== "undefined" ? window.location.origin : "");

		try {
			const res = await fetch(`${apiBase}/api/forgot/forgot-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ role, email }),
			});

			let data = {};
			try {
				data = await res.json();
			} catch (_) {
				// Non-JSON response; leave data as {}
			}

			if (res.ok) {
				localStorage.setItem("otp", data.otp);
				localStorage.setItem("email", email);
				localStorage.setItem("role", role);
				setStep(2);
			} else {
				alert(
					data.error || data.message || "Request failed. Please try again."
				);
			}
		} catch (err) {
			// Network/CORS or invalid URL
			alert(
				err?.message ||
					"Network error. Please check your connection or API URL."
			);
		}
	};

	return (
		<div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-teal-75 overflow-x-hidden">
			{/* Header */}
			<header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-20">
						<Link href="/" className="group">
							<h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-700 group-hover:to-teal-600">
								Calmly
							</h1>
						</Link>
					</div>
				</nav>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="flex items-center justify-center min-h-[calc(100vh-160px)] supports-[height:100dvh]:min-h-[calc(100dvh-160px)]">
					<Card className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm border border-slate-200/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
						{step === 1 ? (
							<div className="space-y-6">
								<div className="text-center space-y-2">
									<h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
										Forgot Password
									</h2>
									<p className="text-slate-600">
										Enter your details to reset password
									</p>
								</div>

								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="role" className="text-slate-700">
												Select Role
											</Label>
											<select
												value={role}
												onChange={(e) => setRole(e.target.value)}
												className="flex h-10 w-full  rounded-md border text-slate-700 border-slate-200/60 bg-white/50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
												required>
												<option value="">Select Role</option>
												<option value="attendee">Attendee</option>
												<option value="mhp">Mental Health Professional</option>
											</select>
										</div>

										<div className="space-y-2">
											<Label htmlFor="email" className="text-slate-700">
												Email
											</Label>
											<Input
												type="email"
												placeholder="Enter your email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className="bg-white/50 text-slate-700 focus:bg-white/70 border-slate-200/60 focus:ring-2 focus:ring-indigo-500/50"
												required
											/>
										</div>
									</div>

									<Button
										type="submit"
										className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white hover:from-indigo-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-indigo-200/40">
										Continue
									</Button>
								</form>

								<p className="text-center text-sm text-slate-600">
									Remember your password?{" "}
									<Link
										href="/signin"
										className="text-indigo-600 hover:underline">
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

			{/* Footer */}
			<footer className="border-t border-slate-200/60 bg-white/80 backdrop-blur-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="text-center text-slate-500 text-sm">
						© 2025 Calmly. Compassion in every connection.
					</div>
				</div>
			</footer>
		</div>
	);
}

function OTPVerification() {
	const [otp, setOtp] = useState("");
	const router = useRouter();

	const handleVerify = async (e) => {
		e.preventDefault();
		if (otp !== localStorage.getItem("otp")) return alert("Invalid OTP");
		router.push("/reset-password");
	};

	return (
		<div className="space-y-6">
			<div className="text-center space-y-2">
				<h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
					OTP Verification
				</h2>
				<p className="text-slate-600">Check your email for verification code</p>
			</div>

			<form onSubmit={handleVerify} className="space-y-6">
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="otp" className="text-slate-700">
							Enter OTP
						</Label>
						<Input
							type="text"
							placeholder="Enter OTP"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							className="bg-white/50 focus:bg-white/70 border-slate-200/60 focus:ring-2 focus:ring-indigo-500/50"
							required
						/>
					</div>
				</div>

				<Button
					type="submit"
					className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white hover:from-indigo-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-indigo-200/40">
					Verify OTP
				</Button>
			</form>
		</div>
	);
}
