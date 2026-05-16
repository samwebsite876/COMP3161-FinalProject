import React, { useMemo, useState } from "react";

const API_BASE = "http://127.0.0.1:5000";

const endpoints = [
  {
    group: "Users",
    name: "Register User",
    method: "POST",
    path: "/register",
    body: {
      user_id: 300010,
      first_name: "Test",
      last_name: "Student",
      email: "teststudent10@uwi.edu",
      username: "teststudent10",
      password: "1234",
      user_type: "student"
    }
  },
  {
    group: "Users",
    name: "Login",
    method: "POST",
    path: "/login",
    body: {
      username: "bobby_washington",
      password: "Z4WxLYw5"
    }
  },
  {
    group: "Courses",
    name: "Create Course",
    method: "POST",
    path: "/courses",
    body: {
      created_by: 200001,
      course_code: "COMP3163",
      title: "Data Analysis",
      assigned_lecturer: 100100
    }
  },
  { group: "Courses", name: "Get Courses", method: "GET", path: "/courses" },
  { group: "Courses", name: "Get Student Courses", method: "GET", path: "/courses/student/5" },
  { group: "Courses", name: "Get Lecturer Courses", method: "GET", path: "/courses/lecturer/100100" },
  {
    group: "Courses",
    name: "Register For Course",
    method: "POST",
    path: "/courses/COMP3163/register",
    body: { student_id: 5 }
  },
  {
    group: "Content",
    name: "Add Section",
    method: "POST",
    path: "/courses/COMP3163/sections",
    body: { title: "Week 1" }
  },
  {
    group: "Content",
    name: "Add Content",
    method: "POST",
    path: "/sections/1/content",
    note: "Change 1 to the real section_id for COMP3163.",
    body: {
      title: "Lecture Slides",
      content_type: "slide",
      content_url: "https://example.com/comp3163-slides.pdf",
      uploaded_by: 100100
    }
  },
  { group: "Content", name: "Get Course Content", method: "GET", path: "/courses/COMP3163/content" },
  {
    group: "Assignments",
    name: "Create Assignment",
    method: "POST",
    path: "/courses/COMP3163/assignments",
    body: {
      title: "Assignment 1",
      description: "Build and test the API",
      due_date: "2026-06-01",
      created_by: 100100
    }
  },
  {
    group: "Assignments",
    name: "Submit Assignment",
    method: "POST",
    path: "/assignments/1/submit",
    note: "Change 1 to the real assignment_id for COMP3163.",
    body: {
      student_id: 5,
      file_url: "https://github.com/student5/comp3163-project"
    }
  },
  {
    group: "Assignments",
    name: "Grade Submission",
    method: "POST",
    path: "/submissions/1/grade",
    note: "Change 1 to the real submission_id.",
    body: {
      grade: 92,
      graded_by: 100100
    }
  },
  { group: "Courses", name: "Get Course Members", method: "GET", path: "/courses/COMP3163/members" },
  {
    group: "Calendar",
    name: "Create Calendar Event",
    method: "POST",
    path: "/courses/COMP3163/calendar-events",
    body: {
      title: "Midterm Exam",
      description: "Covers Weeks 1-5",
      event_date: "2026-06-15",
      start_time: "10:00:00",
      end_time: "12:00:00",
      created_by: 100100
    }
  },
  { group: "Calendar", name: "Get Course Events", method: "GET", path: "/courses/COMP3163/calendar-events" },
  { group: "Calendar", name: "Get Student Events", method: "GET", path: "/students/5/calendar-events?date=2026-06-15" },
  {
    group: "Forums",
    name: "Create Forum",
    method: "POST",
    path: "/courses/COMP3163/forums",
    body: {
      title: "General Discussion",
      description: "Discussion forum for COMP3163",
      created_by: 5
    }
  },
  { group: "Forums", name: "Get Forums", method: "GET", path: "/courses/COMP3163/forums" },
  {
    group: "Forums",
    name: "Create Thread",
    method: "POST",
    path: "/forums/1/threads",
    note: "Change 1 to the real forum_id.",
    body: {
      user_id: 5,
      title: "Exam Question",
      content: "What topics are covered?"
    }
  },
  { group: "Forums", name: "Get Threads", method: "GET", path: "/forums/1/threads", note: "Change 1 to the real forum_id." },
  {
    group: "Forums",
    name: "Add Reply",
    method: "POST",
    path: "/threads/1/replies",
    note: "Change 1 to the real thread_id.",
    body: {
      user_id: 5,
      content: "Weeks 1 to 5.",
      parent_reply_id: null
    }
  },
  { group: "Forums", name: "Get Replies", method: "GET", path: "/threads/1/replies", note: "Change 1 to the real thread_id." },
  { group: "Views", name: "Courses 50 Plus", method: "GET", path: "/views/courses-50-plus" },
  { group: "Views", name: "Students 5 Courses", method: "GET", path: "/views/students-5-courses" },
  { group: "Views", name: "Lecturers 3 Courses", method: "GET", path: "/views/lecturers-3-courses" },
  { group: "Views", name: "Top 10 Courses", method: "GET", path: "/views/top-10-courses" },
  { group: "Views", name: "Top 10 Students", method: "GET", path: "/views/top-10-students" }
];

function format(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
}

export default function App() {
  const groups = useMemo(() => ["All", ...new Set(endpoints.map((e) => e.group))], []);
  const [selected, setSelected] = useState(endpoints[0]);
  const [activeGroup, setActiveGroup] = useState("All");
  const [search, setSearch] = useState("");
  const [path, setPath] = useState(endpoints[0].path);
  const [body, setBody] = useState(JSON.stringify(endpoints[0].body, null, 2));
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const filtered = endpoints.filter((endpoint) => {
    const matchesGroup = activeGroup === "All" || endpoint.group === activeGroup;
    const matchesSearch = `${endpoint.name} ${endpoint.path} ${endpoint.group}`.toLowerCase().includes(search.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  function choose(endpoint) {
    setSelected(endpoint);
    setPath(endpoint.path);
    setBody(endpoint.body ? JSON.stringify(endpoint.body, null, 2) : "");
    setResponse(null);
  }

  async function sendRequest() {
    setLoading(true);
    setResponse(null);

    try {
      const options = {
        method: selected.method,
        headers: {}
      };

      if (selected.method !== "GET") {
        options.headers["Content-Type"] = "application/json";
        options.body = body.trim() || "{}";
      }

      const res = await fetch(`${API_BASE}${path}`, options);
      const text = await res.text();
      let data = text;

      try {
        data = JSON.parse(text);
      } catch {
        data = text || null;
      }

      setResponse({ status: res.status, ok: res.ok, data });
    } catch (error) {
      setResponse({
        status: "Network Error",
        ok: false,
        data: {
          error: "Could not connect to the Flask API. Make sure python api.py is running.",
          details: error.message
        }
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="appShell">
      <section className="hero">
        <p className="eyebrow">COMP3161 University API</p>
        <h1>Frontend Test Dashboard</h1>
        <p className="heroText">Test all Flask endpoints from one screen. Update IDs like section_id, assignment_id, forum_id, and thread_id after creating records.</p>
      </section>

      <section className="layout">
        <aside className="sidebar card">
          <input
            className="search"
            placeholder="Search endpoints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="chips">
            {groups.map((group) => (
              <button
                key={group}
                className={activeGroup === group ? "chip active" : "chip"}
                onClick={() => setActiveGroup(group)}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="endpointList">
            {filtered.map((endpoint) => (
              <button
                key={`${endpoint.method}-${endpoint.path}-${endpoint.name}`}
                className={selected.name === endpoint.name ? "endpoint activeEndpoint" : "endpoint"}
                onClick={() => choose(endpoint)}
              >
                <span className={endpoint.method === "GET" ? "method get" : "method post"}>{endpoint.method}</span>
                <span className="endpointName">{endpoint.name}</span>
                <span className="endpointPath">{endpoint.path}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="workspace">
          <div className="card requestPanel">
            <div className="panelHeader">
              <div>
                <p className="muted">Selected request</p>
                <h2>{selected.name}</h2>
              </div>
              <span className={selected.method === "GET" ? "method get big" : "method post big"}>{selected.method}</span>
            </div>

            {selected.note && <p className="note">{selected.note}</p>}

            <label>Endpoint</label>
            <input className="input" value={path} onChange={(e) => setPath(e.target.value)} />

            {selected.method !== "GET" && (
              <>
                <label>JSON Body</label>
                <textarea className="textarea" value={body} onChange={(e) => setBody(e.target.value)} />
              </>
            )}

            <button className="sendButton" onClick={sendRequest} disabled={loading}>
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>

          <div className="card responsePanel">
            <div className="panelHeader">
              <h2>Response</h2>
              {response && <span className={response.ok ? "status ok" : "status bad"}>{response.status}</span>}
            </div>
            <pre className="responseBox">{response ? format(response.data) : "Send a request to see the response here."}</pre>
          </div>
        </section>
      </section>
    </main>
  );
}
