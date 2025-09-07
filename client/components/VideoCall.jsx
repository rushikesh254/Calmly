"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoCall({ roomID, userID, userName }) {
	const zegoInstanceRef = useRef(null);
	const hasJoinedRef = useRef(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const { ZegoUIKitPrebuilt } = await import(
					"@zegocloud/zego-uikit-prebuilt"
				);

				const appID = process.env.NEXT_PUBLIC_ZEGO_APP_ID || 1519959050;
				const serverSecret =
					process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET ||
					"677daadae0ee12286263a74250a07927";

				const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
					appID,
					serverSecret,
					roomID,
					userID,
					userName
				);

				if (!hasJoinedRef.current) {
					if (!zegoInstanceRef.current) {
						zegoInstanceRef.current = ZegoUIKitPrebuilt.create(kitToken);
					}
					zegoInstanceRef.current.joinRoom({
						container: document.getElementById("video-container"),
						scenario: {
							mode: ZegoUIKitPrebuilt.OneONoneCall,
						},
					});
					hasJoinedRef.current = true;
				}
			} catch {
				setError(true);
			}
		})();
	}, [roomID, userID, userName]);

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 p-4">
				<div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
					<h2 className="text-2xl font-bold text-red-600 mb-4">
						Video Call Service Unavailable
					</h2>
					<p className="text-gray-700 mb-6">
						Our video calling service is currently unavailable. We apologize for
						the inconvenience.
					</p>
					<p className="text-gray-600 text-sm mb-4">
						Please try an alternative communication method or contact support.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			id="video-container"
			className="w-full h-dvh"
			aria-label="Video call container"
			role="region"
		/>
	);
}
