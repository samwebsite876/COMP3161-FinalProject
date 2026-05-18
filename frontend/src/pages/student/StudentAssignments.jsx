import React from "react";
import { TextField } from "../../components/Common";

export default function StudentAssignments({
  user,
  assignmentId,
  setAssignmentId,
  fileUrl,
  setFileUrl,
  submitAssignment,
}) {
  return (
    <section className="page">
      <div className="assignmentSingleCard">
        <div className="panel actionCard">
          <div className="sectionIntro">
            <h2>Submit Assignment</h2>
            <p>Student ID is locked to your logged-in account: {user.user_id}</p>
          </div>

          <div className="assignmentFormGrid studentSubmitGrid">
            <TextField
              label="Assignment ID"
              value={assignmentId}
              setValue={setAssignmentId}
            />

            <TextField label="File URL" value={fileUrl} setValue={setFileUrl} />
          </div>

          <div className="centerButtonRow">
            <button className="secondaryBtn" onClick={submitAssignment}>
              Submit Assignment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
