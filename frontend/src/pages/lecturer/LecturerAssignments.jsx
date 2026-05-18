import React from "react";
import { RecordCards, TextField } from "../../components/Common";

export default function LecturerAssignments({
  courseCode,
  setCourseCode,
  assignmentTitle,
  setAssignmentTitle,
  assignmentDescription,
  setAssignmentDescription,
  dueDate,
  setDueDate,
  submissions,
  selectedSubmission,
  selectSubmission,
  grade,
  setGrade,
  createAssignment,
  loadSubmissions,
  gradeSubmission,
}) {
  return (
    <section className="page">
      <div className="assignmentSingleCard">
        <div className="panel actionCard">
          <h2>Assignments</h2>
          <p>
            Create assignments, load submissions for the course, then select a
            submission to grade. No manual submission ID needed.
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
              <h3>Load Submissions</h3>
              <p>
                Uses the same course code above and your logged-in lecturer ID.
              </p>

              <button className="primaryBtn" onClick={loadSubmissions}>
                Load Course Submissions
              </button>

              <div className="selectableCardGrid">
                {submissions && submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <button
                      type="button"
                      key={submission.submission_id}
                      className={
                        selectedSubmission?.submission_id ===
                        submission.submission_id
                          ? "selectableCard selectedCard"
                          : "selectableCard"
                      }
                      onClick={() => selectSubmission(submission)}
                    >
                      <strong>{submission.assignment_title}</strong>
                      <span>
                        {submission.first_name} {submission.last_name} | Student{" "}
                        {submission.student_id}
                      </span>
                      <small>
                        Grade: {submission.grade ?? "Not graded"} | Submitted:{" "}
                        {submission.submitted_at || "—"}
                      </small>
                    </button>
                  ))
                ) : (
                  <div className="emptyState">
                    No submissions loaded for this course.
                  </div>
                )}
              </div>
            </div>

            <div className="assignmentWideCard">
              <h3>Grade Selected Submission</h3>

              <div className="selectedBox">
                <span>Selected Submission</span>
                <strong>
                  {selectedSubmission
                    ? `${selectedSubmission.assignment_title} - ${selectedSubmission.first_name} ${selectedSubmission.last_name}`
                    : "Choose a submission first"}
                </strong>
              </div>

              <TextField label="Grade" value={grade} setValue={setGrade} />

              <button className="secondaryBtn" onClick={gradeSubmission}>
                Grade Submission
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Submission Records</h2>
        <RecordCards data={submissions} />
      </div>
    </section>
  );
}
