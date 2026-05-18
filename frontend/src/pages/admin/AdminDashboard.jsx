import React from "react";
import { StatCard } from "../../components/Common";

// ADMIN DASHBOARD LOGIC
// The dashboard only shows role and ID. It does not show a shared/default course.
export default function AdminDashboard({ user }) {
  return (
    <section className="page">
      <div className="statsGrid compactStats">
        <StatCard title="Role" value="Admin" />
        <StatCard title="Admin ID" value={user.user_id} />
      </div>

      <div className="panel">
        <h2>Admin Logic</h2>
        <p>
          Admins create users, create courses, register students, check members,
          and view reports.
        </p>
      </div>
    </section>
  );
}
