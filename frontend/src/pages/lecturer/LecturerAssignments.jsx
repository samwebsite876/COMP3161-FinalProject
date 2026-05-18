import React from "react";
import { TextField } from "../../components/Common";

export default function LecturerAssignments({
  courseCode,
  setCourseCode,
  assignmentTitle,
  setAssignmentTitle,
  assignmentDescription,
  setAssignmentDescription,
  dueDate,
  setDueDate,
  submissionId,
  setSubmissionId,
  grade,
  setGrade,
  createAssignment,
  gradeSubmission,
}) {
  return (
    <section className="page">
      <div className="assignmentSingleCard">
        <div className="panel actionCard">
          <h2>Assignments</h2>
          <p>
            Create assignments for your course and grade student submissions
            from one place.
          </p>

          <div className="assignmentVerticalLayout">
            <div className="assignmentWideCard">
              <h3>Create Assignment</h3>

              <TextField
                label="Course Code"
                value={courseCode}
                setValue={setCourseCode}
              />

              <TextField
                label="Title"
                value={assignmentTitle}
                setValue={setAssignmentTitle}
              />

              <TextField
                label="Description"
                value={assignmentDescription}
                setValue={setAssignmentDescription}
              />

              <TextField
                label="Due Date"
                value={dueDate}
                setValue={setDueDate}
              />

              <button className="primaryBtn" onClick={createAssignment}>
                Create Assignment
              </button>
            </div>

            <div className="assignmentWideCard">
              <h3>Grade Submission</h3>

              <TextField
                label="Submission ID"
                value={submissionId}
                setValue={setSubmissionId}
              />

              <TextField
                label="Grade"
                value={grade}
                setValue={setGrade}
              />

              <button className="secondaryBtn" onClick={gradeSubmission}>
                Grade Submission
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
