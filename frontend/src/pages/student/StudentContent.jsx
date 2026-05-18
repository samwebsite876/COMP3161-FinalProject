import React from "react";
import { RecordCards, TextField } from "../../components/Common";

export default function StudentContent({
  courseCode,
  setCourseCode,
  content,
  loadContent,
}) {
  return (
    <section className="page">
      <div className="panel actionCard lookupSingleCard">
        <div className="sectionIntro">
          <h2>View Course Content</h2>
          <p>Enter a registered course code to view its sections and resources.</p>
        </div>

        <div className="lookupRow">
          <TextField
            label="Course Code"
            value={courseCode}
            setValue={setCourseCode}
          />

          <button className="primaryBtn" onClick={loadContent}>
            Load Content
          </button>
        </div>

        <div className="embeddedResults">
          <h3>Course Materials</h3>
          <RecordCards data={content} />
        </div>
      </div>
    </section>
  );
}
