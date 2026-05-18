import React from "react";
import { RecordCards, TextField } from "../../components/Common";

export default function StudentAssignments({
  user,
  courseCode,
  setCourseCode,
  assignments,
  selectedAssignment,
  selectAssignment,
  fileUrl,
  setFileUrl,
  loadAssignments,
  submitAssignment,
}) {
  return (
    <section className="page">
      <div className="assignmentSingleCard">
        <div className="panel actionCard">
          <div className="sectionIntro">
            <h2>Submit Assignment</h2>
            <p>
              Student ID is locked to your logged-in account: {user.user_id}.
              Select a course, choose an assignment, then submit your file URL.
            </p>
          </div>

          <div className="assignmentVerticalLayout">
            <div className="assignmentWideCard">
              <h3>1. Load Assignments</h3>

              <TextField
                label="Course Code"
                value={courseCode}
                setValue={setCourseCode}
              />

              <button className="primaryBtn" onClick={loadAssignments}>
                Load Assignments
              </button>
            </div>

            <div className="assignmentWideCard">
              <h3>2. Choose Assignment</h3>

              <div className="selectableCardGrid">
                {assignments && assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <button
                      type="button"
                      key={assignment.assignment_id}
                      className={
                        selectedAssignment?.assignment_id ===
                        assignment.assignment_id
                          ? "selectableCard selectedCard"
                          : "selectableCard"
                      }
                      onClick={() => selectAssignment(assignment)}
                    >
                      <strong>{assignment.title}</strong>
                      <span>{assignment.description || "No description."}</span>
                      <small>Due: {assignment.due_date || "Not set"}</small>
                    </button>
                  ))
                ) : (
                  <div className="emptyState">
                    No assignments loaded for this course.
                  </div>
                )}
              </div>
            </div>

            <div className="assignmentWideCard">
              <h3>3. Submit Work</h3>

              <div className="selectedBox">
                <span>Selected Assignment</span>
                <strong>
                  {selectedAssignment
                    ? selectedAssignment.title
                    : "Choose an assignment first"}
                </strong>
              </div>

              <TextField
                label="File URL"
                value={fileUrl}
                setValue={setFileUrl}
              />

              <button className="secondaryBtn" onClick={submitAssignment}>
                Submit Assignment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Loaded Assignments</h2>
        <RecordCards data={assignments} />
      </div>
    </section>
  );
}
