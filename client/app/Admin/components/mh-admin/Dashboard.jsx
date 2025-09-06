"use client";
/**
 * Simple landing section for the Mental Health Admin.
 * (Currently not mounted – kept for future dashboard level analytics/widgets.)
 * UI intentionally minimal; classes unchanged to preserve styling.
 */
export const MHADashboard = ({ userName }) => (
  <div>
    <h1 className="text-3xl font-bold">Mental Health Admin Dashboard</h1>
    <p>Welcome, {userName}!</p>
  </div>
);

