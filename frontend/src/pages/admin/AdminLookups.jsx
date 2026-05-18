import React from "react";
import { CourseCard, TextField } from "../../components/Common";

export function StudentCourseLookup({
  studentId,
  setStudentId,
  studentCourses,
  loadStudentCourses,
}) {
  return (
    <section className="page">
      <div className="panel actionCard lookupSingleCard">
        <div className="sectionIntro">
          <h2>Student Course Lookup</h2>
          <p>Search by student ID to review the courses they are registered for.</p>
        </div>

        <div className="lookupRow">
          <TextField
            label="Student ID"
            value={studentId}
            setValue={setStudentId}
          />

          <button className="primaryBtn" onClick={loadStudentCourses}>
            Load Student Courses
          </button>
        </div>

        <div className="embeddedResults">
          <h3>Student Courses</h3>
          <div className="courseGrid">
            {studentCourses.map((course) => (
              <CourseCard key={course.course_code} course={course} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LecturerCourseLookup({
  lecturerId,
  setLecturerId,
  lecturerCourses,
  loadLecturerCourses,
}) {
  return (
    <section className="page">
      <div className="panel actionCard lookupSingleCard">
        <div className="sectionIntro">
          <h2>Lecturer Course Lookup</h2>
          <p>Search by lecturer ID to review the courses assigned to them.</p>
        </div>

        <div className="lookupRow">
          <TextField
            label="Lecturer ID"
            value={lecturerId}
            setValue={setLecturerId}
          />

          <button className="primaryBtn" onClick={loadLecturerCourses}>
            Load Lecturer Courses
          </button>
        </div>

        <div className="embeddedResults">
          <h3>Lecturer Courses</h3>
          <div className="courseGrid">
            {lecturerCourses.map((course) => (
              <CourseCard key={course.course_code} course={course} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
