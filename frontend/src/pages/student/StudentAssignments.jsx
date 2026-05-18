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
            <h2>Assignments</h2>
            <p>
              Student ID is locked to your logged-in account: {user.user_id}.
              Load your assignments, check submission status, and view grades on
              this same page.
            </p>
          </div>

          <div className="assignmentVerticalLayout">
            <div className="assignmentWideCard">
              <h3>1. Load My Assignments</h3>
              <p>
                Leave Course Code blank to load assignments from all registered
                courses, or enter a course code to filter.
              </p>

              <TextField
                label="Course Code"
                value={courseCode}
                setValue={setCourseCode}
              />

              <button className="primaryBtn" onClick={loadAssignments}>
                Load Assignments & Grades
              </button>
            </div>

            <div className="assignmentWideCard">
              <h3>2. Select Assignment to Submit</h3>

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
                      <strong>{assignment.assignment_title}</strong>
                      <span>
                        {assignment.course_code} | Due:{" "}
                        {assignment.due_date || "Not set"}
                      </span>
                      <small>Status: {assignment.status}</small>
                      <small>Grade: {assignment.grade_status}</small>
                    </button>
                  ))
                ) : (
                  <div className="emptyState">
                    No assignments loaded yet.
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
                    ? selectedAssignment.assignment_title
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
        <h2>Assignments, Submissions & Grades</h2>
        <RecordCards data={assignments} />
      </div>
    </section>
  );
}
