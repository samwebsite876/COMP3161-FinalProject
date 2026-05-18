import React from "react";
import { RecordCards, TextField } from "../../components/Common";

export default function LecturerMembers({
  courseCode,
  setCourseCode,
  members,
  loadMembers,
}) {
  return (
    <section className="page">
      <div className="panel actionCard">
        <h2>Course Members</h2>
        <TextField
          label="Course Code"
          value={courseCode}
          setValue={setCourseCode}
        />
        <button className="primaryBtn" onClick={loadMembers}>
          Load Members
        </button>
      </div>

      <RecordCards data={members} />
    </section>
  );
}
