"use client";

import { useState } from "react";
import Link from "next/link";

export const SessionCard = ({
	professional,
	datetime,
	sessionStatus,
	recommendations,
	paymentStatus,
	sessionID,
	sessionType,
}) => {
	const isPaymentCompleted = paymentStatus === "completed";
	const isPaymentOffline = sessionType === "offline";
	const isApproved = sessionStatus === "approved";
	const isDeclined = sessionStatus === "declined";
	const isOffline = sessionType === "offline";
	const [loading, setLoading] = useState(false);
	const sessionDate = new Date(datetime);
	const today = new Date();
	const isToday = sessionDate.toDateString() === today.toDateString();
	const isPastSession = sessionDate < today && !isToday;
	const [showFullRecommendation, setShowFullRecommendation] = useState(false);

	const handlePayment = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/initiatePayment`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						sessionId: sessionID,
						cus_name: "Customer Name",
						cus_email: "rushikeshbodke884@gmail.com",
						cus_address: "Mumbai",
						cus_city: "Mumbai",
						cus_state: "Maharashtra",
						cus_postcode: "400001",
						cus_country: "India",
						cus_phone: "7410726319",
						ship_name: "Customer Name",
						ship_address: "Mumbai",
						ship_city: "Mumbai",
						ship_state: "Maharashtra",
						ship_postcode: "400001",
						ship_country: "India",
						product_name: "Product Name",
						product_category: "Category",
						tran_id: `REF${Date.now()}`,
						redirect_url: window.location.href,
					}),
				}
			);

			const data = await response.json();
			window.location.href = data.redirectURL;
		} catch {
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-md p-6 mb-4 transition-all duration-200 hover:shadow-lg border border-gray-100">
			{isApproved &&
				(isPaymentCompleted || isPaymentOffline) &&
				!isPastSession && (
					<div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-600 rounded-lg animate-bounce">
						<p className="text-sm font-semibold text-blue-800 flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fillRule="evenodd"
									d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
									clipRule="evenodd"
								/>
							</svg>
							Session Scheduled at{" "}
							{sessionDate.toLocaleString("en-US", {
								weekday: "short",
								month: "short",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
								year: "numeric",
							})}
						</p>
					</div>
				)}

			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-xl font-semibold text-gray-800 mb-2">
						Session with {professional.name}
					</h3>
					<p className="text-sm text-gray-600 flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 text-gray-400"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fillRule="evenodd"
								d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
								clipRule="evenodd"
							/>
						</svg>

						{new Date(datetime).toLocaleString("en-US", {
							weekday: "short",
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
					<p className="text-sm text-gray-600 flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 text-gray-400"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
						</svg>
						{sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} Session
					</p>

					{!isDeclined && (
						<p className="text-sm text-gray-600 flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 text-gray-400"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fillRule="evenodd"
									d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
									clipRule="evenodd"
								/>
							</svg>
							{isOffline ? (
								"Payment Status: Offline"
							) : (
								<>
									Payment Status:{" "}
									{paymentStatus.charAt(0).toUpperCase() +
										paymentStatus.slice(1)}
									<span
										className={`font-medium ${
											paymentStatus === "completed"
												? "text-green-600"
												: paymentStatus === "pending"
												? "text-amber-600"
												: "text-red-600"
										}`}></span>
								</>
							)}
						</p>
					)}
				</div>
				<span
					className={`px-3 py-1 rounded-full text-sm font-medium ${
						sessionStatus === "approved"
							? "bg-indigo-100 text-indigo-800"
							: sessionStatus === "pending"
							? "bg-red-100 text-red-800"
							: "bg-emerald-100 text-emerald-800 "
					}`}>
					{sessionStatus.charAt(0).toUpperCase() + sessionStatus.slice(1)}
				</span>
			</div>

			{recommendations && (
				<div className="mt-6 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
					<div className="flex items-start gap-3">
						<div className="flex-shrink-0 p-2 bg-indigo-100 rounded-lg">
							<svg
								className="w-5 h-5 text-indigo-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<div className="flex-1">
							<h4 className="text-sm font-semibold text-indigo-800 mb-2">
								Professional Notes
							</h4>
							<p className="text-gray-700 text-sm leading-relaxed">
								{recommendations.length > 200 && !showFullRecommendation ? (
									<>
										{recommendations.slice(0, 200).replace(/\s+\S*$/, "")}
										<span className="text-gray-400">...</span>
									</>
								) : (
									recommendations
								)}
							</p>
							{recommendations.length > 200 && (
								<button
									onClick={() =>
										setShowFullRecommendation(!showFullRecommendation)
									}
									className="text-indigo-600 hover:text-indigo-700 text-sm mt-2 underline underline-offset-2">
									{showFullRecommendation
										? "Show less"
										: "Read full recommendation"}
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			<div className="mt-6 flex justify-between items-center">
				{isApproved && isPaymentCompleted && isToday && (
					<div className="text-md text-teal-600 font-semibold">
						Session ID: {sessionID}
					</div>
				)}

				{isApproved && !isPaymentCompleted && !isOffline && (
					<button
						className="bg-violet-900 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 flex items-center gap-2 motion-safe:animate-bounce"
						onClick={handlePayment}
						disabled={loading}
						aria-busy={loading}
						aria-label="Proceed to payment">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
								clipRule="evenodd"
							/>
						</svg>
						{loading ? "Processing..." : "Proceed to Payment"}
					</button>
				)}

				{isApproved && isPaymentCompleted && isToday && !isOffline && (
					<Link
						legacyBehavior
						href={`/room/${sessionID}`}
						passHref>
						<a
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Join session in a new tab">
							<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
										clipRule="evenodd"
									/>
								</svg>
								Join Session
							</button>
						</a>
					</Link>
				)}
			</div>
		</div>
	);
};
