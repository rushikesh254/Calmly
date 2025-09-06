"use client";
import { AdminDashboardLayout } from "@/app/admin/components/AdminDashboardLayout";
import { AnalyticsCards } from "@/app/admin/components/general-admin/AnalyticsCards";
import { UsersTable } from "@/app/admin/components/general-admin/UsersTable";

export const GeneralAdminDashboard = ({ userName, email }) => {
	return (
		<AdminDashboardLayout
			role="general-admin"
			userName={userName}
			email={email}>
			<div className="space-y-8">
				<div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
						General Admin Dashboard
					</h1>
					<p className="text-sm text-slate-600 mt-2">
						System wide overview & user management
					</p>
				</div>
				<AnalyticsCards />
				<section>
					<h2 className="text-xl font-semibold mb-4 text-slate-800 ">Users</h2>
					<UsersTable />
				</section>
			</div>
		</AdminDashboardLayout>
	);
};
