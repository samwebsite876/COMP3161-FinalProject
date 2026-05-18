import React from "react";
import { PaginatedRecordCards } from "../../components/Common";

export default function AdminReports({ reportTitle, reportData, loadReport }) {
  return (
    <section className="page">
      <div className="sectionHeader">
        <div>
          <h2>Reports</h2>
          <p>
            Reports display vertically and use Next/Previous pagination. No
            records are removed.
          </p>
        </div>
      </div>

      <div className="quickGrid">
        <button
          onClick={() =>
            loadReport("Courses With 50+ Students", "/views/courses-50-plus")
          }
        >
          Courses 50+
        </button>

        <button
          onClick={() =>
            loadReport(
              "Students Taking 5+ Courses",
              "/views/students-5-courses",
            )
          }
        >
          Students 5 Courses
        </button>

        <button
          onClick={() =>
            loadReport(
              "Lecturers Teaching 3+ Courses",
              "/views/lecturers-3-courses",
            )
          }
        >
          Lecturers 3 Courses
        </button>

        <button
          onClick={() => loadReport("Top 10 Courses", "/views/top-10-courses")}
        >
          Top 10 Courses
        </button>

        <button
          onClick={() =>
            loadReport("Top 10 Students", "/views/top-10-students")
          }
        >
          Top 10 Students
        </button>
      </div>

      <div className="panel">
        <h2>{reportTitle || "Select a report"}</h2>
        <PaginatedRecordCards
          title={reportTitle || "Report Results"}
          data={reportData}
          pageSize={10}
        />
      </div>
    </section>
  );
}
