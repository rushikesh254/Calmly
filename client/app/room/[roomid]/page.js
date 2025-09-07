"use client";

import { useParams } from "next/navigation";
import VideoCall from "../../../components/VideoCall";

export default function RoomPage() {
	const { roomid } = useParams();

	const userID = "user" + Math.floor(Math.random() * 10000);
	const userName = "i.e. : Alice";

	return (
		<div className="h-dvh">
			<VideoCall roomID={roomid} userID={userID} userName={userName} />
		</div>
	);
}
