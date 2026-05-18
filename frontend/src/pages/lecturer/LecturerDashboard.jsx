import React from "react";
import { StatCard } from "../../components/Common";

// LECTURER DASHBOARD LOGIC
// The dashboard only shows role and ID. It does not show a shared/default course.
export default function LecturerDashboard({ user }) {
  return (
    <section className="page">
      <div className="statsGrid compactStats">
        <StatCard title="Role" value="Lecturer" />
        <StatCard title="Lecturer ID" value={user.user_id} />
      </div>

      <div className="panel">
        <h2>Lecturer</h2>
        <p>
          Lecturers manage assigned courses, members, content, assignments,
          grades, calendar events, and forums.
        </p>
      </div>
    </section>
  );
}
