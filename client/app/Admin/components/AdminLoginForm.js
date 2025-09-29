"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";
import { ReloadIcon } from "@radix-ui/react-icons";

// Small UI constants keep markup tidy without changing styles
const INPUT_STYLES =
	"mt-2 bg-white/90 dark:bg-white/5 border border-slate-200/60 dark:border-white/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all duration-300";
const TITLE = "Admin Portal";
const SUBTITLE = "Enter your credentials to access admin portal";

// Contract
// Props: email, password, error, handleEmailChange, handlePasswordChange, handleSubmit
// Behavior: wraps handleSubmit with a local loading state and shows an inline error alert
export const AdminLoginForm = ({
	email,
	password,
	error,
	handleEmailChange,
	handlePasswordChange,
	handleSubmit,
}) => {
	const [isLoading, setIsLoading] = useState(false);

	// Keep the parent API intact: delegate to handleSubmit and control loading locally
	const handleFormSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await handleSubmit(e);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			<div
				className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40"
				aria-hidden="true">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.2),transparent_55%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(20,184,166,0.15),transparent_60%)]" />
			</div>
			<div className="relative z-10 flex w-full flex-col">
				<div className="mb-4 mr-10 flex items-center justify-end">
					<ThemeToggle />
				</div>

				{/* <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-slate-200/70 bg-white/70 px-5 py-4 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/70">
						<Link href="/" className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 shadow-lg">
								<Heart className="h-5 w-5 text-white" />
							</span>
							<span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
								Calmly Admin
							</span>
						</Link>
						
					</div> */}

				<div className="flex flex-1 items-center justify-center px-6 pb-16 pt-10">
					<Card className="group w-full max-w-md border border-slate-200/60 bg-white/85 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-3xl hover:bg-white/95 dark:border-slate-700/60 dark:bg-slate-950/75 dark:hover:bg-slate-900/80">
						<div className="mb-8 flex flex-col space-y-2 text-center">
							<h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
								{TITLE}
							</h1>
							<p className="text-sm text-slate-600 dark:text-slate-300">
								{SUBTITLE}
							</p>
						</div>

						<form onSubmit={handleFormSubmit} className="space-y-6">
							<div className="space-y-4">
								<div className="relative">
									<Label
										htmlFor="email"
										className="text-slate-600 dark:text-slate-300">
										Email
									</Label>
									<Input
										id="email"
										type="email"
										placeholder="admin@example.com"
										value={email}
										onChange={handleEmailChange}
										className={INPUT_STYLES}
										disabled={isLoading}
									/>
								</div>

								<div className="relative">
									<Label
										htmlFor="password"
										className="text-slate-600 dark:text-slate-300">
										Password
									</Label>
									<Input
										id="password"
										type="password"
										placeholder="••••••••"
										value={password}
										onChange={handlePasswordChange}
										className={INPUT_STYLES}
										disabled={isLoading}
									/>
								</div>
							</div>

							{error && (
								<Alert
									variant="destructive"
									className="border border-red-500/40 bg-red-500/10 py-3 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
									{error}
								</Alert>
							)}

							<Button
								type="submit"
								className="w-full transform rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-indigo-700 hover:to-teal-600 hover:shadow-xl active:scale-95"
								disabled={isLoading}>
								{isLoading ? (
									<>
										<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
										Authenticating...
									</>
								) : (
									<span className="drop-shadow-md">Sign In</span>
								)}
							</Button>
						</form>
					</Card>
				</div>
			</div>
		</div>
	);
};
