import React from "react";
import { CourseCard } from "../../components/Common";

export default function LecturerCourses({ courses, loadMyCourses }) {
  return (
    <section className="page">
      <div className="sectionHeader">
        <div>
          <h2>My Assigned Courses</h2>
          <p>Uses the logged-in lecturer ID.</p>
        </div>

        <button className="primaryBtn" onClick={loadMyCourses}>
          Load My Courses
        </button>
      </div>

      <div className="courseGrid">
        {courses.map((course) => (
          <CourseCard key={course.course_code} course={course} />
        ))}
      </div>
    </section>
  );
}
