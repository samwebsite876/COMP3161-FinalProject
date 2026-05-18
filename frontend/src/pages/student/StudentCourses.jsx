import React from "react";
import { CourseCard } from "../../components/Common";

export default function StudentCourses({ courses, loadMyCourses }) {
  return (
    <section className="page">
      <div className="sectionHeader">
        <div>
          <h2>My Courses</h2>
          <p>Uses the logged-in user ID as the student ID.</p>
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
