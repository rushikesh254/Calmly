"use client";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

const statusColor = (role, status) => {
	if (role !== "mhp")
		return "bg-emerald-50 text-emerald-700 border-emerald-200";
	switch (status) {
		case "approved":
			return "bg-emerald-50 text-emerald-700 border-emerald-200";
		case "rejected":
			return "bg-rose-50 text-rose-700 border-rose-200";
		default:
			return "bg-amber-50 text-amber-700 border-amber-200";
	}
};

export const UsersTable = () => {
	const [users, setUsers] = useState([]);
	const [filter, setFilter] = useState("all");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [actionLoading, setActionLoading] = useState(null);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			setError("");
			const token = localStorage.getItem("accessToken");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/admin/manage/users`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed");
			setUsers(data.users || []);
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const doAction = async (id, newStatus) => {
		try {
			setActionLoading(id + newStatus);
			const token = localStorage.getItem("accessToken");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/admin/manage/users/${id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ status: newStatus }),
				}
			);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed");
			setUsers((u) =>
				u.map((x) => (x._id === id ? { ...x, status: newStatus } : x))
			);
		} catch (e) {
			setError(e.message);
		} finally {
			setActionLoading(null);
		}
	};

	const deleteUser = async (id, role) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this account? This cannot be undone."
			)
		) {
			return;
		}
		try {
			setActionLoading(id + "delete");
			const token = localStorage.getItem("accessToken");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/admin/manage/users/${id}?role=${role}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Delete failed");
			setUsers((list) => list.filter((u) => u._id !== id));
		} catch (e) {
			setError(e.message);
		} finally {
			setActionLoading(null);
		}
	};

	const filtered = useMemo(
		() => users.filter((u) => filter === "all" || u.role === filter),
		[users, filter]
	);

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-3">
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="border rounded px-3 py-1 text-sm text-slate-500 bg-white">
					<option value="all">All Roles</option>
					<option value="attendee">Attendees</option>
					<option value="mhp">Professionals</option>
					<option value="admin">Admins</option>
				</select>
				<Button onClick={fetchUsers} size="sm" disabled={loading}>
					Refresh
				</Button>
				{loading && <span className="text-xs text-slate-500">Loading...</span>}
				{error && <span className="text-xs text-rose-600">{error}</span>}
			</div>
			<div className="overflow-x-auto border rounded-xl bg-white/80">
				<table className="min-w-full text-sm">
					<thead className="bg-slate-50 text-slate-600 uppercase text-xs">
						<tr>
							<th className="px-4 py-2 text-left font-medium">Name</th>
							<th className="px-4 py-2 text-left font-medium">Email</th>
							<th className="px-4 py-2 text-left font-medium">Role</th>
							<th className="px-4 py-2 text-left font-medium">Status</th>
							<th className="px-4 py-2 text-left font-medium">Actions</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((u) => (
							<tr key={u._id} className="border-t last:border-b">
								<td className="px-4 py-2 font-medium text-slate-800">
									{u.name ||
										u.fullName ||
										u.firstName + " " + (u.lastName || "")}
								</td>
								<td className="px-4 py-2 text-slate-600">{u.email}</td>
								<td className="px-4 py-2 capitalize">{u.role}</td>
								<td className="px-4 py-2">
									<span
										className={`inline-block px-2 py-0.5 text-xs rounded-full border ${statusColor(
											u.role,
											u.status
										)}`}>
										{u.role === "mhp" ? u.status || "pending" : "active"}
									</span>
								</td>
								<td className="px-4 py-2 space-x-2">
									{u.role === "mhp" && (
										<>
											<Button
												variant="secondary"
												size="sm"
												disabled={actionLoading === u._id + "approved"}
												onClick={() => doAction(u._id, "approved")}>
												Approve
											</Button>
											<Button
												variant="destructive"
												size="sm"
												disabled={actionLoading === u._id + "rejected"}
												onClick={() => doAction(u._id, "rejected")}>
												Reject
											</Button>
										</>
									)}
									{(u.role === "mhp" || u.role === "attendee") && (
										<Button
											variant="outline"
											size="sm"
											className="border-rose-300 text-rose-600 hover:bg-rose-50"
											disabled={actionLoading === u._id + "delete"}
											onClick={() => deleteUser(u._id, u.role)}>
											Delete
										</Button>
									)}
								</td>
							</tr>
						))}
						{!loading && filtered.length === 0 && (
							<tr>
								<td
									colSpan={5}
									className="px-4 py-6 text-center text-slate-500">
									No users found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
