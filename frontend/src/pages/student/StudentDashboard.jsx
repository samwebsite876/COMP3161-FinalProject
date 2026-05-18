import React from "react";
import { StatCard } from "../../components/Common";

// STUDENT DASHBOARD LOGIC
// The dashboard only shows role and ID. It does not show a shared/default course.
export default function StudentDashboard({ user }) {
  return (
    <section className="page">
      <div className="statsGrid compactStats">
        <StatCard title="Role" value="Student" />
        <StatCard title="Student ID" value={user.user_id} />
      </div>

      <div className="panel">
        <h2>Student Logic</h2>
        <p>
          Students can view enrolled courses, open course content, submit
          assignments, check calendar events, and participate in forums.
        </p>
      </div>
    </section>
  );
}
