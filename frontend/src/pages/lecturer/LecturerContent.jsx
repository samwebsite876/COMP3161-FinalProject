import React from "react";
import { RecordCards, SelectField, TextField } from "../../components/Common";

export default function LecturerContent({
  user,
  courseCode,
  setCourseCode,
  sectionTitle,
  setSectionTitle,
  sectionId,
  setSectionId,
  contentTitle,
  setContentTitle,
  contentType,
  setContentType,
  contentUrl,
  setContentUrl,
  content,
  addSection,
  addContent,
  loadContent,
}) {
  return (
    <section className="page">
      <div className="contentSingleCard">
        <div className="panel actionCard">
          <h2>Course Content</h2>
          <p>
            Add sections, upload materials, and load course content from one
            place.
          </p>

          <div className="contentVerticalLayout">
            <div className="contentWideCard">
              <h3>Add Section</h3>

              <TextField
                label="Course Code"
                value={courseCode}
                setValue={setCourseCode}
              />

              <TextField
                label="Section Title"
                value={sectionTitle}
                setValue={setSectionTitle}
              />

              <button className="secondaryBtn" onClick={addSection}>
                Add Section
              </button>
            </div>

            <div className="contentWideCard">
              <h3>Add Content + Load Content</h3>
              <p>Uploaded By is automatically {user.user_id}</p>

              <TextField
                label="Section ID"
                value={sectionId}
                setValue={setSectionId}
              />

              <TextField
                label="Content Title"
                value={contentTitle}
                setValue={setContentTitle}
              />

              <SelectField
                label="Content Type"
                value={contentType}
                setValue={setContentType}
                options={[
                  { value: "slide", label: "slide" },
                  { value: "file", label: "file" },
                  { value: "link", label: "link" },
                ]}
              />

              <TextField
                label="URL"
                value={contentUrl}
                setValue={setContentUrl}
              />

              <div className="contentButtonRow">
                <button className="primaryBtn" onClick={addContent}>
                  Add Content
                </button>

                <button className="secondaryBtn" onClick={loadContent}>
                  Load Content
                </button>
              </div>
            </div>
          </div>

          <div className="embeddedResults">
            <h3>Loaded Content</h3>
            <RecordCards data={content} />
          </div>
        </div>
      </div>
    </section>
  );
}
