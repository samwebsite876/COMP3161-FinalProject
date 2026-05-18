import React from "react";
import { RecordCards, TextField } from "../../components/Common";

export default function AdminMembers({
  courseCode,
  setCourseCode,
  members,
  loadMembers,
}) {
  return (
    <section className="page">
      <div className="adminMembersSingleCard">
        <div className="panel actionCard">
          <h2>Course Members</h2>
          <p>
            Load the lecturer and students for a course. Students register
            themselves from the Student Portal.
          </p>

          <div className="adminMembersLayout">
            <div className="adminMembersCard">
              <h3>Course Members</h3>

              <TextField
                label="Course Code"
                value={courseCode}
                setValue={setCourseCode}
              />

              <button className="primaryBtn" onClick={loadMembers}>
                Load Members
              </button>
            </div>
          </div>

          {members && (
            <div className="embeddedResults">
              <h3>Members for {members.course_code}</h3>

              <h4>Lecturer</h4>
              <RecordCards data={members.lecturer} />

              <h4>Students</h4>
              <RecordCards data={members.students || []} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
