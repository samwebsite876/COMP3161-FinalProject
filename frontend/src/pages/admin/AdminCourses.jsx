import React from "react";
import { CourseCard, TextField } from "../../components/Common";

export default function AdminCourses({
  user,
  courses,
  newCourseCode,
  setNewCourseCode,
  newCourseTitle,
  setNewCourseTitle,
  assignedLecturer,
  setAssignedLecturer,
  createCourse,
  loadCourses,
}) {
  return (
    <section className="page">
      <div className="adminCoursesSingleCard">
        <div className="panel actionCard">
          <h2>Courses</h2>
          <p>Create a course, then load all available courses.</p>

          <div className="adminCoursesLayout">
            <div className="adminCoursesCard">
              <h3>Create Course</h3>
              <p>Created By is automatically your admin ID: {user.user_id}</p>

              <TextField
                label="Course Code"
                value={newCourseCode}
                setValue={setNewCourseCode}
              />

              <TextField
                label="Title"
                value={newCourseTitle}
                setValue={setNewCourseTitle}
              />

              <TextField
                label="Assigned Lecturer"
                value={assignedLecturer}
                setValue={setAssignedLecturer}
              />

              <button className="secondaryBtn" onClick={createCourse}>
                Create Course
              </button>
            </div>

            <div className="adminCoursesCard">
              <h3>All Courses</h3>
              <p>Load and review all courses currently stored in the system.</p>

              <button className="primaryBtn" onClick={loadCourses}>
                Load Courses
              </button>
            </div>
          </div>

          <div className="embeddedResults">
            <h3>Loaded Courses</h3>

            <div className="courseGrid">
              {courses.map((course) => (
                <CourseCard key={course.course_code} course={course} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}