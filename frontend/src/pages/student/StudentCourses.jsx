import React from "react";
import { CourseCard, TextField } from "../../components/Common";

export default function StudentCourses({
  courseCode,
  setCourseCode,
  courses,
  loadMyCourses,
  registerForCourse,
}) {
  return (
    <section className="page">
      <div className="sectionHeader">
        <div>
          <h2>My Courses</h2>
          <p>
            Register yourself for a course, then load the courses connected to
            your logged-in student account.
          </p>
        </div>

        <button className="primaryBtn" onClick={loadMyCourses}>
          Load My Courses
        </button>
      </div>

      <div className="panel actionCard lookupSingleCard">
        <div className="sectionIntro">
          <h2>Register for Course</h2>
          <p>
            Enter the course code. Your student ID is taken automatically from
            your JWT login, so students cannot register another student.
          </p>
        </div>

        <div className="lookupRow">
          <TextField
            label="Course Code"
            value={courseCode}
            setValue={setCourseCode}
          />

          <button className="secondaryBtn" onClick={registerForCourse}>
            Register for Course
          </button>
        </div>
      </div>

      <div className="courseGrid">
        {courses.map((course) => (
          <CourseCard key={course.course_code} course={course} />
        ))}
      </div>
    </section>
  );
}
