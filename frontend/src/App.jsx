import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "http://127.0.0.1:5000";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [message, setMessage] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [selectedLoginRole, setSelectedLoginRole] = useState("sysadmin");

  const [courses, setCourses] = useState([]);

  const [courseCode, setCourseCode] = useState("C001");
  const [studentId, setStudentId] = useState("5");
  const [lecturerId, setLecturerId] = useState("100098");

  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("1234");

  const [registerUserId, setRegisterUserId] = useState("300004");
  const [firstName, setFirstName] = useState("Test");
  const [lastName, setLastName] = useState("Student");
  const [email, setEmail] = useState("teststudent300004@uwi.edu");
  const [username, setUsername] = useState("test_student_300004");
  const [password, setPassword] = useState("1234");
  const [userType, setUserType] = useState("student");

  const [studentCourses, setStudentCourses] = useState([]);
  const [lecturerCourses, setLecturerCourses] = useState([]);
  const [members, setMembers] = useState(null);

  const [newCourseCode, setNewCourseCode] = useState("C999");
  const [newCourseTitle, setNewCourseTitle] = useState("Database Systems Demo");
  const [createdBy, setCreatedBy] = useState("300001");
  const [assignedLecturer, setAssignedLecturer] = useState("100098");

  const [content, setContent] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("Week 1");
  const [sectionId, setSectionId] = useState("6");
  const [contentTitle, setContentTitle] = useState("Slides");
  const [contentType, setContentType] = useState("slide");
  const [contentUrl, setContentUrl] = useState("http://example.com");
  const [uploadedBy, setUploadedBy] = useState("100098");

  const [assignmentId, setAssignmentId] = useState("1");
  const [assignmentTitle, setAssignmentTitle] = useState("Assignment 1");
  const [assignmentDescription, setAssignmentDescription] = useState("Test");
  const [dueDate, setDueDate] = useState("2026-05-01");
  const [assignmentCreatedBy, setAssignmentCreatedBy] = useState("100098");

  const [submissionId, setSubmissionId] = useState("1");
  const [fileUrl, setFileUrl] = useState("http://example.com/file.pdf");
  const [grade, setGrade] = useState("85");
  const [gradedBy, setGradedBy] = useState("100098");

  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState("Exam");
  const [eventDescription, setEventDescription] = useState("Final exam for C001");
  const [eventDate, setEventDate] = useState("2026-04-25");
  const [startTime, setStartTime] = useState("10:00:00");
  const [endTime, setEndTime] = useState("12:00:00");
  const [eventCreatedBy, setEventCreatedBy] = useState("100098");

  const [forums, setForums] = useState([]);
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);

  const [forumId, setForumId] = useState("");
const [threadId, setThreadId] = useState("");
  const [forumTitle, setForumTitle] = useState("Discussion");
  const [forumDescription, setForumDescription] = useState("Course discussion forum");
  const [forumCreatedBy, setForumCreatedBy] = useState("100098");
  const [threadTitle, setThreadTitle] = useState("Help");
  const [threadContent, setThreadContent] = useState("Explain normalization");
  const [replyContent, setReplyContent] = useState("Thanks");

  const [reportTitle, setReportTitle] = useState("");
  const [reportData, setReportData] = useState([]);

  async function apiRequest(path, options = {}) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {})
        },
        ...options
      });

      const text = await response.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      return { ok: response.ok, status: response.status, data };
    } catch {
      return {
        ok: false,
        status: "Network Error",
        data: {
          error: "Could not connect to Flask API. Make sure python3 api.py is running."
        }
      };
    }
  }

  function showResult(result, fallback) {
    setMessage(result.data.message || result.data.error || fallback);
  }

  function normalizeRole(role) {
    const cleanRole = String(role || "").toLowerCase();

    if (cleanRole === "admin") return "sysadmin";
    if (cleanRole === "sysadmin") return "sysadmin";
    if (cleanRole === "lecturer") return "lecturer";
    if (cleanRole === "student") return "student";

    return selectedLoginRole;
  }

  function getDashboardTitle() {
    if (!currentUser) return "Dashboard";
    if (currentUser.user_type === "student") return "Student Portal";
    if (currentUser.user_type === "lecturer") return "Lecturer Portal";
    return "Admin Portal";
  }

  function getNavItems() {
    if (!currentUser) return [];

    const role = currentUser.user_type;

    if (role === "student") {
      return [
        ["dashboard", "Dashboard"],
        ["students", "My Courses"],
        ["content", "Course Content"],
        ["assignments", "Assignments"],
        ["calendar", "Calendar"],
        ["forums", "Forums"]
      ];
    }

    if (role === "lecturer") {
      return [
        ["dashboard", "Dashboard"],
        ["lecturers", "My Courses"],
        ["members", "Course Members"],
        ["content", "Course Content"],
        ["assignments", "Assignments"],
        ["calendar", "Calendar"],
        ["forums", "Forums"]
      ];
    }

    return [
      ["dashboard", "Dashboard"],
      ["users", "User Access"],
      ["courses", "Courses"],
      ["students", "Student Courses"],
      ["lecturers", "Lecturer Courses"],
      ["members", "Registration & Members"],
      ["content", "Course Content"],
      ["assignments", "Assignments"],
      ["calendar", "Calendar"],
      ["forums", "Forums"],
      ["reports", "Reports"]
    ];
  }

  function changePage(page) {
    setActivePage(page);
    setMessage("");
  }

  function logout() {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setActivePage("dashboard");
    setMessage("");
  }

  async function loginUser(e) {
    e.preventDefault();

    const result = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({
        username: loginUsername.trim(),
        password: loginPassword
      })
    });

    if (!result.ok) {
      showResult(result, "Login failed.");
      return;
    }

    const userData = result.data.user || result.data;
    const role = normalizeRole(userData.user_type || userData.role || selectedLoginRole);

    if (result.data.token) {
      localStorage.setItem("token", result.data.token);
    }

    const loggedInUser = {
      user_id: userData.user_id || userData.id || "",
      username: userData.username || loginUsername.trim(),
      user_type: role
    };

    setCurrentUser(loggedInUser);
    setMessage("");
    setActivePage("dashboard");

    if (role === "student" && loggedInUser.user_id) {
      setStudentId(String(loggedInUser.user_id));
    }

    if (role === "lecturer" && loggedInUser.user_id) {
      setLecturerId(String(loggedInUser.user_id));
    }
  }

  async function registerUser() {
    const result = await apiRequest("/register", {
      method: "POST",
      body: JSON.stringify({
        user_id: Number(registerUserId),
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password,
        user_type: userType
      })
    });

    showResult(result, "Register request completed.");
  }

  async function createCourse() {
    const result = await apiRequest("/courses", {
      method: "POST",
      body: JSON.stringify({
        created_by: Number(createdBy),
        course_code: newCourseCode,
        title: newCourseTitle,
        assigned_lecturer: Number(assignedLecturer)
      })
    });

    showResult(result, "Course request completed.");

    if (result.ok) loadCourses();
  }

  async function loadCourses() {
    const result = await apiRequest("/courses");

    if (result.ok) {
      setCourses(result.data);
      setMessage("");
    } else {
      setCourses([]);
      setMessage(result.data.error || "Courses could not be loaded.");
    }
  }

  async function loadStudentCourses() {
    const result = await apiRequest(`/courses/student/${studentId}`);

    if (result.ok) {
      setStudentCourses(result.data);
      setMessage("");
    } else {
      setStudentCourses([]);
      setMessage(result.data.error || "Student courses could not be loaded.");
    }
  }

  async function loadLecturerCourses() {
    const result = await apiRequest(`/courses/lecturer/${lecturerId}`);

    if (result.ok) {
      setLecturerCourses(result.data);
      setMessage("");
    } else {
      setLecturerCourses([]);
      setMessage(result.data.error || "Lecturer courses could not be loaded.");
    }
  }

  async function registerStudentForCourse() {
    const result = await apiRequest(`/courses/${courseCode}/register`, {
      method: "POST",
      body: JSON.stringify({
        student_id: Number(studentId)
      })
    });

    showResult(result, "Course registration request completed.");
  }

  async function loadMembers() {
    const result = await apiRequest(`/courses/${courseCode}/members`);

    if (result.ok) {
      setMembers(result.data);
      setMessage("");
    } else {
      setMembers(null);
      setMessage(result.data.error || "Course members could not be loaded.");
    }
  }

  async function addSection() {
    const result = await apiRequest(`/courses/${courseCode}/sections`, {
      method: "POST",
      body: JSON.stringify({
        title: sectionTitle
      })
    });

    showResult(result, "Section request completed.");

    if (result.ok && result.data.section_id) {
      setSectionId(String(result.data.section_id));
    }
  }

  async function addContent() {
    const result = await apiRequest(`/sections/${sectionId}/content`, {
      method: "POST",
      body: JSON.stringify({
        title: contentTitle,
        content_type: contentType,
        content_url: contentUrl,
        uploaded_by: Number(uploadedBy)
      })
    });

    showResult(result, "Content request completed.");

    if (result.ok) loadContent();
  }

  async function loadContent() {
    const result = await apiRequest(`/courses/${courseCode}/content`);

    if (result.ok) {
      setContent(result.data);
      setMessage("");
    } else {
      setContent([]);
      setMessage(result.data.error || "Content could not be loaded.");
    }
  }

  async function createAssignment() {
    const result = await apiRequest(`/courses/${courseCode}/assignments`, {
      method: "POST",
      body: JSON.stringify({
        title: assignmentTitle,
        description: assignmentDescription,
        due_date: dueDate,
        created_by: Number(assignmentCreatedBy)
      })
    });

    showResult(result, "Assignment request completed.");
  }

  async function submitAssignment() {
    const result = await apiRequest(`/assignments/${assignmentId}/submit`, {
      method: "POST",
      body: JSON.stringify({
        student_id: Number(studentId),
        file_url: fileUrl
      })
    });

    showResult(result, "Submission request completed.");
  }

  async function gradeSubmission() {
    const result = await apiRequest(`/submissions/${submissionId}/grade`, {
      method: "POST",
      body: JSON.stringify({
        grade: Number(grade),
        graded_by: Number(gradedBy)
      })
    });

    showResult(result, "Grade request completed.");
  }

  async function createCalendarEvent() {
    const result = await apiRequest(`/courses/${courseCode}/calendar-events`, {
      method: "POST",
      body: JSON.stringify({
        title: eventTitle,
        description: eventDescription,
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        created_by: Number(eventCreatedBy)
      })
    });

    showResult(result, "Calendar event request completed.");

    if (result.ok) loadCalendarEvents();
  }

  async function loadCalendarEvents() {
    const result = await apiRequest(`/courses/${courseCode}/calendar-events`);

    if (result.ok) {
      setEvents(result.data);
      setMessage("");
    } else {
      setEvents([]);
      setMessage(result.data.error || "Events could not be loaded.");
    }
  }

  async function loadStudentEvents() {
    const result = await apiRequest(
      `/students/${studentId}/calendar-events?date=${eventDate}`
    );

    if (result.ok) {
      setEvents(result.data);
      setMessage("Student events loaded successfully.");
    } else {
      setEvents([]);
      setMessage(result.data.error || "Student events could not be loaded.");
    }
  }
async function createForum() {
  const result = await apiRequest(`/courses/${courseCode}/forums`, {
    method: "POST",
    body: JSON.stringify({
      title: forumTitle,
      description: forumDescription,
      created_by: Number(forumCreatedBy)
    })
  });

  showResult(result, "Forum request completed.");

  if (result.ok) {
    loadForums();
  }
}

async function loadForums() {
  const result = await apiRequest(`/courses/${courseCode}/forums`);

  if (result.ok) {
    setForums(result.data);
    setForumId("");
    setThreadId("");
    setThreads([]);
    setReplies([]);

    setMessage(
      result.data.length > 0
        ? "Forums loaded. Select a forum to continue."
        : "No forums found for this course."
    );
  } else {
    setForums([]);
    setMessage(result.data.error || "Forums could not be loaded.");
  }
}

function selectForum(forum) {
  setForumId(String(forum.forum_id));
  setThreadId("");
  setThreads([]);
  setReplies([]);
  setMessage(`Selected forum: ${forum.title}`);
}

function selectThread(thread) {
  setThreadId(String(thread.thread_id));
  setReplies([]);
  setMessage(`Selected thread: ${thread.title}`);
}

async function createThread() {
  if (!forumId) {
    setMessage("Please select a forum first.");
    return;
  }

  const result = await apiRequest(`/forums/${forumId}/threads`, {
    method: "POST",
    body: JSON.stringify({
      user_id: Number(studentId),
      title: threadTitle,
      content: threadContent
    })
  });

  showResult(result, "Thread request completed.");

  if (result.ok) {
    loadThreads();
  }
}

async function loadThreads() {
  if (!forumId) {
    setMessage("Please select a forum first.");
    return;
  }

  const result = await apiRequest(`/forums/${forumId}/threads`);

  if (result.ok) {
    setThreads(result.data);
    setReplies([]);
    setMessage(
      result.data.length > 0
        ? "Threads loaded. Select a thread to reply."
        : "No threads found for this forum."
    );
  } else {
    setThreads([]);
    setMessage(result.data.error || "Threads could not be loaded.");
  }
}

async function addReply() {
  if (!threadId) {
    setMessage("Please select a thread first.");
    return;
  }

  const result = await apiRequest(`/threads/${threadId}/replies`, {
    method: "POST",
    body: JSON.stringify({
      user_id: Number(studentId),
      content: replyContent,
      parent_reply_id: null
    })
  });

  showResult(result, "Reply request completed.");

  if (result.ok) {
    loadReplies();
  }
}

async function loadReplies() {
  if (!threadId) {
    setMessage("Please select a thread first.");
    return;
  }

  const result = await apiRequest(`/threads/${threadId}/replies`);

  if (result.ok) {
    setReplies(result.data);
    setMessage(
      result.data.length > 0
        ? "Replies loaded successfully."
        : "No replies found for this thread."
    );
  } else {
    setReplies([]);
    setMessage(result.data.error || "Replies could not be loaded.");
  }
}
  async function loadReport(title, path) {
    const result = await apiRequest(path);

    if (result.ok) {
      setReportTitle(title);
      setReportData(result.data);
      setMessage(`${title} loaded successfully.`);
    } else {
      setReportTitle(title);
      setReportData([]);
      setMessage(result.data.error || "Report could not be loaded.");
    }
  }

  useEffect(() => {
    if (currentUser) {
      loadCourses();
    }
  }, [currentUser]);

  const navItems = getNavItems();

  if (!currentUser) {
    return (
      <div className="loginPage">
        <div className="loginCard">
          <div className="brand loginBrand">
            <div className="brandIcon">U</div>
            <div>
              <h2>UniVLE</h2>
              <p>Course Management Portal</p>
            </div>
          </div>

          <h1>Sign in to your portal</h1>
          <p className="loginText">
            Log in once and the system will display the correct dashboard for
            students, lecturers, or administrators.
          </p>

          {message && <div className="alert">{message}</div>}

          <form onSubmit={loginUser} className="loginForm">
            <label>Username</label>
            <input
              className="textInput"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />

            <label>Password</label>
            <input
              className="textInput"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <label>Demo Role</label>
            <select
              className="textInput"
              value={selectedLoginRole}
              onChange={(e) => setSelectedLoginRole(e.target.value)}
            >
              <option value="sysadmin">Admin</option>
              <option value="lecturer">Lecturer</option>
              <option value="student">Student</option>
            </select>

            <button className="primaryBtn" type="submit">
              Login
            </button>
          </form>

          <p className="helperText">
            The role selector is for demo use in case your backend login response
            does not return the user type.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandIcon">U</div>
          <div>
            <h2>UniVLE</h2>
            <p>{getDashboardTitle()}</p>
          </div>
        </div>

        <nav>
          {navItems.map(([key, label]) => (
            <button
              key={key}
              className={activePage === key ? "navItem active" : "navItem"}
              onClick={() => changePage(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <button className="logoutBtn" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="pageLabel">COMP3161 Final Project</p>
            <h1>{navItems.find(([key]) => key === activePage)?.[1] || "Dashboard"}</h1>
          </div>

          <div className="userBadge">
            <span>
              {currentUser.username} | {currentUser.user_type}
            </span>
          </div>
        </header>

        {message && <div className="alert">{message}</div>}

        {activePage === "dashboard" && (
          <section className="page">
            <div className="statsGrid">
              <StatCard title="Portal" value={getDashboardTitle()} />
              <StatCard title="Course Code" value={courseCode} />
              <StatCard title="Student ID" value={studentId} />
              <StatCard title="Lecturer ID" value={lecturerId} />
            </div>

            <div className="panel">
              <h2>Welcome, {currentUser.username}</h2>
              <p>
                You are signed in as a {currentUser.user_type}. The navigation on the
                left is based on your role in the course management system.
              </p>
            </div>

            <div className="statusCard">
              <span className="statusDot"></span>
              Connected to Flask API at http://127.0.0.1:5000
            </div>

            <div className="panel">
              <h2>Quick Actions</h2>
              <div className="quickGrid">
                {navItems
                  .filter(([key]) => key !== "dashboard")
                  .slice(0, 6)
                  .map(([key, label]) => (
                    <button key={key} onClick={() => changePage(key)}>
                      {label}
                    </button>
                  ))}
              </div>
            </div>
          </section>
        )}

        {activePage === "users" && (
          <section className="page">
            <div className="sectionHeader">
              <div>
                <h2>User Access</h2>
                <p>Register a new user and test API login.</p>
              </div>
            </div>

            <div className="miniGrid">
              <div className="panel actionCard">
                <h2>Register User</h2>

                <TextField label="User ID" value={registerUserId} setValue={setRegisterUserId} />
                <TextField label="First Name" value={firstName} setValue={setFirstName} />
                <TextField label="Last Name" value={lastName} setValue={setLastName} />
                <TextField label="Email" value={email} setValue={setEmail} />
                <TextField label="Username" value={username} setValue={setUsername} />
                <TextField label="Password" value={password} setValue={setPassword} />
                <TextField label="User Type" value={userType} setValue={setUserType} />

                <button className="primaryBtn" onClick={registerUser}>
                  Register User
                </button>
              </div>
            </div>
          </section>
        )}

        {activePage === "courses" && (
          <section className="page">
            <div className="sectionHeader">
              <div>
                <h2>Courses</h2>
                <p>Create a course and view all available courses.</p>
              </div>
              <button className="primaryBtn" onClick={loadCourses}>
                Refresh Courses
              </button>
            </div>

            <div className="miniGrid">
              <div className="panel actionCard">
                <h2>Create Course</h2>

                <TextField label="Created By" value={createdBy} setValue={setCreatedBy} />
                <TextField label="Course Code" value={newCourseCode} setValue={setNewCourseCode} />
                <TextField label="Title" value={newCourseTitle} setValue={setNewCourseTitle} />
                <TextField label="Assigned Lecturer" value={assignedLecturer} setValue={setAssignedLecturer} />

                <button className="secondaryBtn" onClick={createCourse}>
                  Create Course
                </button>
              </div>

              <div className="panel actionCard wideCard">
                <h2>Available Courses</h2>
                <p>Showing the first 24 courses returned by the API.</p>

                <div className="courseGrid">
                  {courses.slice(0, 24).map((course) => (
                    <CourseCard key={course.course_code} course={course} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activePage === "students" && (
          <section className="page">
            {currentUser.user_type === "student" ? (
              <div className="panel lookupPanel">
                <div>
                  <h2>My Courses</h2>
                  <p>View the courses assigned to your student account.</p>
                </div>

                <p>
                  <strong>Student ID:</strong> {studentId}
                </p>

                <button className="primaryBtn" onClick={loadStudentCourses}>
                  Load My Courses
                </button>
              </div>
            ) : (
              <LookupPanel
                title="Get Student Courses"
                description="Enter a student ID to view registered courses."
                label="Student ID"
                value={studentId}
                onChange={setStudentId}
                buttonText="Load Student Courses"
                onClick={loadStudentCourses}
              />
            )}

            <ResultGrid>
              {studentCourses.map((course) => (
                <CourseCard key={course.course_code} course={course} />
              ))}
            </ResultGrid>
          </section>
        )}

        {activePage === "lecturers" && (
          <section className="page">
            <LookupPanel
              title={currentUser.user_type === "lecturer" ? "My Courses" : "Get Lecturer Courses"}
              description="Enter a lecturer ID to view assigned courses."
              label="Lecturer ID"
              value={lecturerId}
              onChange={setLecturerId}
              buttonText="Load Lecturer Courses"
              onClick={loadLecturerCourses}
            />

            <ResultGrid>
              {lecturerCourses.map((course) => (
                <CourseCard key={course.course_code} course={course} />
              ))}
            </ResultGrid>
          </section>
        )}

        {activePage === "members" && (
          <section className="page">
            <div className="sectionHeader">
              <div>
                <h2>Registration & Course Members</h2>
                <p>Register students and view course membership.</p>
              </div>
            </div>

            <div className="miniGrid">
              {currentUser.user_type === "sysadmin" && (
                <div className="panel actionCard">
                  <h2>Register for Course</h2>
                  <TextField label="Course Code" value={courseCode} setValue={setCourseCode} />
                  <TextField label="Student ID" value={studentId} setValue={setStudentId} />

                  <button className="secondaryBtn" onClick={registerStudentForCourse}>
                    Register Student
                  </button>
                </div>
              )}

              <div className="panel actionCard">
                <h2>Get Course Members</h2>
                <TextField label="Course Code" value={courseCode} setValue={setCourseCode} />

                <button className="primaryBtn" onClick={loadMembers}>
                  Load Members
                </button>
              </div>
            </div>

            {members && (
              <div className="panel">
                <h2>Course {members.course_code}</h2>

                <h3>Lecturer</h3>
                <p>
                  {members.lecturer?.first_name} {members.lecturer?.last_name}{" "}
                  ({members.lecturer?.user_id})
                </p>

                <h3>Students</h3>
                <Table
                  rows={members.students?.slice(0, 25) || []}
                  columns={["user_id", "first_name", "last_name"]}
                />
              </div>
            )}
          </section>
        )}

        {activePage === "content" && (
          <section className="page">
            <div className="sectionHeader">
              <div>
                <h2>Course Content</h2>
                <p>
                  {currentUser.user_type === "student"
                    ? "View learning materials uploaded for your course."
                    : "Add sections, upload course materials, and view course content."}
                </p>
              </div>
            </div>

            {currentUser.user_type === "student" ? (
              <div className="panel actionCard">
                <h2>View Course Materials</h2>
                <p>Enter your course code to view available materials.</p>

                <label>Course Code</label>
                <input
                  className="textInput"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />

                <button className="primaryBtn" onClick={loadContent}>
                  Load Course Content
                </button>
              </div>
            ) : (
              <div className="miniGrid">
                <div className="panel actionCard">
                  <h2>1. Add Section</h2>
                  <p>Create a section such as Week 1 or Week 2.</p>

                  <TextField label="Course Code" value={courseCode} setValue={setCourseCode} />
                  <TextField label="Section Title" value={sectionTitle} setValue={setSectionTitle} />

                  <button className="secondaryBtn" onClick={addSection}>
                    Add Section
                  </button>
                </div>

                <div className="panel actionCard">
                  <h2>2. Add Content</h2>
                  <p>Upload a resource to an existing section.</p>

                  <TextField label="Section ID" value={sectionId} setValue={setSectionId} />
                  <TextField label="Content Title" value={contentTitle} setValue={setContentTitle} />
                  <TextField label="Content Type" value={contentType} setValue={setContentType} />
                  <TextField label="Content URL" value={contentUrl} setValue={setContentUrl} />
                  <TextField label="Uploaded By" value={uploadedBy} setValue={setUploadedBy} />

                  <button className="primaryBtn" onClick={addContent}>
                    Add Content
                  </button>
                </div>

                <div className="panel actionCard">
                  <h2>3. Get Course Content</h2>
                  <p>Load all sections and resources for the selected course.</p>

                  <TextField label="Course Code" value={courseCode} setValue={setCourseCode} />

                  <button className="primaryBtn" onClick={loadContent}>
                    Load Course Content
                  </button>
                </div>
              </div>
            )}

            <div className="panel">
              <h2>Loaded Content</h2>
              <p>Showing sections and resources for {courseCode}.</p>

              <div className="contentList">
                {content.length === 0 && (
                  <div className="emptyState">
                    No content loaded yet.
                  </div>
                )}

                {content.map((item, index) => (
                  <div className="contentItem" key={index}>
                    <div className="contentHeader">
                      <span className="courseCode">
                        {item.section_title || item.section || "Section"}
                      </span>

                      {item.content_type && (
                        <span className="contentType">
                          {item.content_type}
                        </span>
                      )}
                    </div>

                    <h3>{item.title || "Untitled Section"}</h3>

                    {item.content_url ? (
                      <a href={item.content_url} target="_blank" rel="noreferrer">
                        Open Resource
                      </a>
                    ) : (
                      <p>No content uploaded for this section yet.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activePage === "assignments" && (
  <section className="page">
    <div className="sectionHeader">
      <div>
        <h2>Assignments</h2>
        <p>
          {currentUser.user_type === "student"
            ? "Submit assignments for your registered courses."
            : "Create, submit, and grade assignments using the API flow."}
        </p>
      </div>
    </div>

    <div className="assignmentLayout">
      {(currentUser.user_type === "lecturer" || currentUser.user_type === "sysadmin") && (
        <div className="panel actionCard">
          <h2>Create Assignment</h2>
          <p>Create a new assignment for a course.</p>

          <TextField label="Course Code" value={courseCode} setValue={setCourseCode} />
          <TextField label="Title" value={assignmentTitle} setValue={setAssignmentTitle} />
          <TextField label="Description" value={assignmentDescription} setValue={setAssignmentDescription} />
          <TextField label="Due Date" value={dueDate} setValue={setDueDate} />
          <TextField label="Created By" value={assignmentCreatedBy} setValue={setAssignmentCreatedBy} />

          <button className="primaryBtn" onClick={createAssignment}>
            Create Assignment
          </button>
        </div>
      )}

      {(currentUser.user_type === "student" || currentUser.user_type === "sysadmin") && (
        <div
  className={
    currentUser.user_type === "student"
      ? "panel assignmentSubmitCard studentAssignmentCard"
      : "panel assignmentSubmitCard"
  }
>
          <div className="assignmentHeader">
            <div>
              <h2>
                {currentUser.user_type === "student"
                  ? "Submit Assignment"
                  : "Submit Assignment as Student"}
              </h2>

              <p>
                {currentUser.user_type === "student"
                  ? "Enter the assignment ID given by your lecturer, then attach your submission link."
                  : "Submit an assignment on behalf of a student for testing or administrative purposes."}
              </p>
            </div>

            <span className="assignmentBadge">
              {currentUser.user_type === "student" ? "Student Submission" : "Admin Test"}
            </span>
          </div>

          <div className="lockedInfo">
            <span>Student Account</span>
            <strong>{currentUser.username}</strong>
            <p>Student ID: {studentId}</p>
          </div>

          <div className="assignmentFormGrid">
            <div>
              <label>Assignment ID</label>
              <input
                className="textInput"
                value={assignmentId}
                onChange={(e) => setAssignmentId(e.target.value)}
                placeholder="Example: 1"
              />
              <small className="fieldHint">
                Use the assignment ID provided by your lecturer.
              </small>
            </div>

            {currentUser.user_type !== "student" && (
              <div>
                <label>Student ID</label>
                <input
                  className="textInput"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
                <small className="fieldHint">
                  Admins can submit on behalf of a student.
                </small>
              </div>
            )}

            <div className="fullWidth">
              <label>Submission File URL</label>
              <input
                className="textInput"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="http://example.com/file.pdf"
              />
              <small className="fieldHint">
                Paste the link to your uploaded assignment file.
              </small>
            </div>
          </div>

          <button className="secondaryBtn submitWideBtn" onClick={submitAssignment}>
            Submit Assignment
          </button>
        </div>
      )}

      {(currentUser.user_type === "lecturer" || currentUser.user_type === "sysadmin") && (
        <div className="panel actionCard">
          <h2>Grade Submission</h2>
          <p>Enter the submission ID and assign a grade.</p>

          <TextField label="Submission ID" value={submissionId} setValue={setSubmissionId} />
          <TextField label="Grade" value={grade} setValue={setGrade} />
          <TextField label="Graded By" value={gradedBy} setValue={setGradedBy} />

          <button className="primaryBtn" onClick={gradeSubmission}>
            Grade Submission
          </button>
        </div>
      )}
    </div>
  </section>
)}

       {activePage === "calendar" && (
  <section className="page">
    <div className="sectionHeader">
      <div>
        <h2>Calendar</h2>
        <p>
          {currentUser.user_type === "student"
            ? "View calendar events for your registered courses."
            : "Create calendar events and view course or student events."}
        </p>
      </div>
    </div>

    <div className="miniGrid">
      {(currentUser.user_type === "lecturer" || currentUser.user_type === "sysadmin") && (
        <div className="panel actionCard">
          <h2>Create Calendar Event</h2>

          <TextField label="Course Code" value={courseCode} setValue={setCourseCode} />
          <TextField label="Title" value={eventTitle} setValue={setEventTitle} />
          <TextField label="Description" value={eventDescription} setValue={setEventDescription} />
          <TextField label="Event Date" value={eventDate} setValue={setEventDate} />
          <TextField label="Start Time" value={startTime} setValue={setStartTime} />
          <TextField label="End Time" value={endTime} setValue={setEndTime} />
          <TextField label="Created By" value={eventCreatedBy} setValue={setEventCreatedBy} />

          <button className="secondaryBtn" onClick={createCalendarEvent}>
            Create Event
          </button>
        </div>
      )}

      <div className="panel actionCard">
        <h2>
          {currentUser.user_type === "student" ? "My Calendar" : "Get Events"}
        </h2>

        <p>
          {currentUser.user_type === "student"
            ? "View course events and your personal calendar events."
            : "Load events for a course or for a specific student."}
        </p>

        <TextField label="Course Code" value={courseCode} setValue={setCourseCode} />

        {currentUser.user_type === "student" ? (
          <p>
            <strong>Student ID:</strong> {studentId}
          </p>
        ) : (
          <TextField label="Student ID" value={studentId} setValue={setStudentId} />
        )}

        <TextField label="Date" value={eventDate} setValue={setEventDate} />

        <button className="primaryBtn" onClick={loadCalendarEvents}>
          Load Course Events
        </button>

        <button className="secondaryBtn" onClick={loadStudentEvents}>
          {currentUser.user_type === "student"
            ? "Load My Events"
            : "Load Student Events"}
        </button>
      </div>
    </div>

    <div className="panel">
      <h2>Loaded Events</h2>
      <p>Calendar results will appear below.</p>

      <div className="list">
        {events.length === 0 && (
          <div className="emptyState">
            No events loaded yet.
          </div>
        )}

        {events.map((event) => (
          <div className="listItem" key={event.event_id}>
            <h3>{event.title}</h3>
            <p>{event.description || "No description provided."}</p>
            <p>
              {event.event_date} | {event.start_time || "N/A"} - {event.end_time || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)}
      {activePage === "forums" && (
  <section className="page">
    <div className="sectionHeader">
      <div>
        <h2>Forums</h2>
        <p>
          {currentUser.user_type === "student"
            ? "View course forums, ask questions, and reply to discussions."
            : "Create course forums, manage threads, and reply to discussions."}
        </p>
      </div>
    </div>

    <div className="forumStepper">
      <div className={forumId ? "step activeStep" : "step"}>
        <span>1</span>
        <div>
          <strong>Forum</strong>
          <p>{forumId ? `Forum ID ${forumId} selected` : "Select a forum"}</p>
        </div>
      </div>

      <div className={threadId ? "step activeStep" : "step"}>
        <span>2</span>
        <div>
          <strong>Thread</strong>
          <p>{threadId ? `Thread ID ${threadId} selected` : "Select a thread"}</p>
        </div>
      </div>

      <div className={threadId ? "step activeStep" : "step"}>
        <span>3</span>
        <div>
          <strong>Reply</strong>
          <p>{threadId ? "Ready to reply" : "Choose a thread first"}</p>
        </div>
      </div>
    </div>

    <div className="forumActionGrid">
      <div className="panel actionCard">
        <h2>Course Forums</h2>
        <p>Load forums for the selected course.</p>

        <TextField
          label="Course Code"
          value={courseCode}
          setValue={setCourseCode}
        />

        <button className="primaryBtn" onClick={loadForums}>
          Load Forums
        </button>

        {(currentUser.user_type === "lecturer" ||
          currentUser.user_type === "sysadmin") && (
          <div className="subForm">
            <h3>Create New Forum</h3>

            <TextField
              label="Forum Title"
              value={forumTitle}
              setValue={setForumTitle}
            />

            <TextField
              label="Description"
              value={forumDescription}
              setValue={setForumDescription}
            />

            <TextField
              label="Created By"
              value={forumCreatedBy}
              setValue={setForumCreatedBy}
            />

            <button className="secondaryBtn" onClick={createForum}>
              Create Forum
            </button>
          </div>
        )}
      </div>

      <div className="panel actionCard">
        <h2>Discussion Threads</h2>
        <p>
          {forumId
            ? "Create or load threads for the selected forum."
            : "Select a forum before creating or loading threads."}
        </p>

        <div className="selectedBox">
          <span>Selected Forum</span>
          <strong>{forumId ? `Forum ID ${forumId}` : "No forum selected"}</strong>
        </div>

        <TextField
          label="Thread Title"
          value={threadTitle}
          setValue={setThreadTitle}
        />

        <TextField
          label="Thread Content"
          value={threadContent}
          setValue={setThreadContent}
        />

        <div className="buttonGroup">
          <button className="secondaryBtn" onClick={createThread}>
            Create Thread
          </button>

          <button className="primaryBtn" onClick={loadThreads}>
            Load Threads
          </button>
        </div>
      </div>

      <div className="panel actionCard">
        <h2>Replies</h2>
        <p>
          {threadId
            ? "Add or load replies for the selected thread."
            : "Select a thread before replying."}
        </p>

        <div className="selectedBox">
          <span>Selected Thread</span>
          <strong>{threadId ? `Thread ID ${threadId}` : "No thread selected"}</strong>
        </div>

        <TextField
          label="Reply Content"
          value={replyContent}
          setValue={setReplyContent}
        />

        <div className="buttonGroup">
          <button className="secondaryBtn" onClick={addReply}>
            Add Reply
          </button>

          <button className="primaryBtn" onClick={loadReplies}>
            Load Replies
          </button>
        </div>
      </div>
    </div>

    <div className="forumResultsClean">
      <div className="panel">
        <h2>Available Forums</h2>
        <p>Choose a forum to view or create discussion threads.</p>

        <div className="cardList">
          {forums.length === 0 && (
            <div className="emptyState">No forums loaded yet.</div>
          )}

          {forums.map((forum) => (
            <div
              className={
                String(forum.forum_id) === forumId
                  ? "discussionCard selectedCard"
                  : "discussionCard"
              }
              key={forum.forum_id}
            >
              <div>
                <span className="courseCode">{forum.course_code}</span>
                <h3>{forum.title}</h3>
                <p>{forum.description || "No description provided."}</p>
                <small>Forum ID: {forum.forum_id}</small>
              </div>

              <button className="miniBtn" onClick={() => selectForum(forum)}>
                {String(forum.forum_id) === forumId ? "Selected" : "Use Forum"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Threads</h2>
        <p>
          {forumId
            ? "Choose a thread to view or add replies."
            : "Select a forum to load threads."}
        </p>

        <div className="cardList">
          {threads.length === 0 && (
            <div className="emptyState">No threads loaded yet.</div>
          )}

          {threads.map((thread) => (
            <div
              className={
                String(thread.thread_id) === threadId
                  ? "discussionCard selectedCard"
                  : "discussionCard"
              }
              key={thread.thread_id}
            >
              <div>
                <span className="courseCode">Forum {thread.forum_id}</span>
                <h3>{thread.title}</h3>
                <p>{thread.content}</p>
                <small>Thread ID: {thread.thread_id}</small>
              </div>

              <button className="miniBtn" onClick={() => selectThread(thread)}>
                {String(thread.thread_id) === threadId
                  ? "Selected"
                  : "Reply to Thread"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Replies</h2>
        <p>Replies for the selected thread will appear here.</p>

        <div className="cardList">
          {replies.length === 0 && (
            <div className="emptyState">No replies loaded yet.</div>
          )}

          {replies.map((reply) => (
            <div className="replyCard" key={reply.reply_id}>
              <p>{reply.content}</p>
              <small>
                Reply ID: {reply.reply_id} | User: {reply.user_id}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)}

        {activePage === "reports" && (
          <section className="page">
            <div className="sectionHeader">
              <div>
                <h2>System Reports</h2>
                <p>View database reports generated from SQL views.</p>
              </div>
            </div>

            <div className="miniGrid">
              <button className="panel reportButton" onClick={() => loadReport("Courses With 50+ Students", "/views/courses-50-plus")}>
                Courses With 50+ Students
              </button>
              <button className="panel reportButton" onClick={() => loadReport("Students Taking 5+ Courses", "/views/students-5-courses")}>
                Students Taking 5+ Courses
              </button>
              <button className="panel reportButton" onClick={() => loadReport("Lecturers Teaching 3+ Courses", "/views/lecturers-3-courses")}>
                Lecturers Teaching 3+ Courses
              </button>
              <button className="panel reportButton" onClick={() => loadReport("Top 10 Courses", "/views/top-10-courses")}>
                Top 10 Courses
              </button>
              <button className="panel reportButton" onClick={() => loadReport("Top 10 Students", "/views/top-10-students")}>
                Top 10 Students
              </button>
            </div>

            <div className="panel">
              <h2>{reportTitle || "Select a report"}</h2>
              <p>Report results will appear below.</p>
              {reportData.length === 0 ? (
                <div className="emptyState">No report data loaded yet.</div>
              ) : (
                <Table rows={reportData.slice(0, 25)} />
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function TextField({ label, value, setValue }) {
  return (
    <>
      <label>{label}</label>
      <input
        className="textInput"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="statCard">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <article className="courseCard">
      <div className="courseCode">{course.course_code?.toUpperCase()}</div>
      <h3>{course.title}</h3>
      <p>
        Lecturer:{" "}
        {course.first_name && course.last_name
          ? `${course.first_name} ${course.last_name}`
          : course.assigned_lecturer}
      </p>
    </article>
  );
}

function LookupPanel({ title, description, label, value, onChange, buttonText, onClick }) {
  return (
    <div className="panel lookupPanel">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <label>{label}</label>
      <div className="formRow">
        <input
          className="textInput"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button className="primaryBtn" onClick={onClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

function ResultGrid({ children }) {
  return <div className="courseGrid">{children}</div>;
}

function Table({ rows, columns }) {
  if (!rows || rows.length === 0) {
    return <div className="emptyState">No data available.</div>;
  }

  const tableColumns = columns || Object.keys(rows[0]);

  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            {tableColumns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {tableColumns.map((column) => (
                <td key={column}>{String(row[column] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResultPanel({ title, rows }) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <div className="emptyState">No {title.toLowerCase()} loaded yet.</div>
      ) : (
        <Table rows={rows.slice(0, 10)} />
      )}
    </div>
  );
}