import React, { useEffect, useMemo, useState } from "react";

export function StatCard({ title, value }) {
  return (
    <div className="statCard">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

export function TextField({
  label,
  value,
  setValue,
  type = "text",
  placeholder = "",
}) {
  return (
    <label className="fieldLabel">
      <span>{label}</span>
      <input
        className="textInput"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
      />
    </label>
  );
}

export function SelectField({ label, value, setValue, options }) {
  return (
    <label className="fieldLabel">
      <span>{label}</span>
      <select
        className="textInput"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CourseCard({ course }) {
  return (
    <div className="courseCard">
      <div className="courseCode">{course.course_code}</div>
      <h3>{course.title}</h3>
      {course.assigned_lecturer && (
        <p>Lecturer ID: {course.assigned_lecturer}</p>
      )}
      {(course.first_name || course.last_name) && (
        <p>
          {course.first_name} {course.last_name}
        </p>
      )}
    </div>
  );
}

export function Table({ rows = [], columns = [] }) {
  if (!rows || rows.length === 0) {
    return <div className="emptyState">No records found.</div>;
  }

  const cols = columns.length ? columns : Object.keys(rows[0]);

  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            {cols.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {cols.map((column) => (
                <td key={column}>{String(row?.[column] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatLabel(key) {
  return String(key)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return null;
  return String(value);
}

export function RecordCard({ record, title }) {
  if (!record || typeof record !== "object") {
    return (
      <div className="resultCard">
        <p>{formatValue(record)}</p>
      </div>
    );
  }

  const entries = Object.entries(record);
  const heading =
    title ||
    record.title ||
    record.course_code ||
    record.username ||
    record.first_name ||
    record.forum_id ||
    record.thread_id ||
    record.reply_id ||
    "Record";

  return (
    <div className="resultCard">
      <h3>{heading}</h3>

      <div className="recordFields">
        {entries.map(([key, value]) => {
          const formattedValue = formatValue(value);

          if (formattedValue === null) {
            return (
              <div className="nestedRecord" key={key}>
                <strong>{formatLabel(key)}</strong>
                <RecordCards data={value} />
              </div>
            );
          }

          return (
            <div className="recordField" key={key}>
              <span>{formatLabel(key)}</span>
              <strong>{formattedValue}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RecordCards({ data, emptyMessage = "No records found." }) {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <div className="emptyState">{emptyMessage}</div>;
  }

  const records = Array.isArray(data) ? data : [data];

  return (
    <div className="recordGrid">
      {records.map((record, index) => (
        <RecordCard key={index} record={record} />
      ))}
    </div>
  );
}

export function PaginatedRecordCards({
  data = [],
  title = "Results",
  pageSize = 10,
}) {
  const [page, setPage] = useState(0);
  const list = Array.isArray(data) ? data : data ? [data] : [];
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));

  useEffect(() => {
    setPage(0);
  }, [title, data]);

  const pageData = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return list.slice(start, end);
  }, [list, page, pageSize]);

  function previousPage() {
    setPage((currentPage) => Math.max(0, currentPage - 1));
  }

  function nextPage() {
    setPage((currentPage) => Math.min(totalPages - 1, currentPage + 1));
  }

  return (
    <div className="reportViewer">
      <div className="reportHeader">
        <div>
          <h3>{title}</h3>
          <p>
            {list.length} total record{list.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="pagerControls">
          <button
            className="miniBtn light"
            onClick={previousPage}
            disabled={page === 0}
          >
            Previous
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            className="miniBtn"
            onClick={nextPage}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>

      <RecordCards data={pageData} />
    </div>
  );
}
