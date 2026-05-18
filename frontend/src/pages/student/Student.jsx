import React, { useState } from "react";
import { apiRequest } from "../../api/apiClient";
import ForumTools from "../../components/ForumTools";
import Layout from "../../components/Layout";
import StudentAssignments from "./StudentAssignments";
import StudentCalendar from "./StudentCalendar";
import StudentContent from "./StudentContent";
import StudentCourses from "./StudentCourses";
import StudentDashboard from "./StudentDashboard";

// ================================
// STUDENT PORTAL LOGIC
// Students use their logged-in user_id as student_id.
// They can view courses, view content, submit assignments, check calendar,
// and participate in forums.
// ================================
export default function StudentPortal({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [message, setMessage] = useState("");

  const [courseCode, setCourseCode] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [forumId, setForumId] = useState("");
  const [threadId, setThreadId] = useState("");
  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState("",);
  const [replyContent, setReplyContent] = useState("");

  const [courses, setCourses] = useState([]);
  const [content, setContent] = useState([]);
  const [events, setEvents] = useState([]);
  const [forums, setForums] = useState([]);
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);

  const navItems = [
    ["dashboard", "Dashboard"],
    ["courses", "My Courses"],
    ["content", "Course Content"],
    ["assignments", "Assignments"],
    ["calendar", "Calendar"],
    ["forums", "Forums"],
  ];

  function show(result, fallback) {
    setMessage(result.data.message || result.data.error || fallback);
  }

  function handlePageChange(page) {
    setMessage("");
    setActivePage(page);
  }

  async function loadMyCourses() {
    const result = await apiRequest(`/courses/student/${user.user_id}`);

    if (result.ok) {
      setCourses(result.data);
    }

    show(result, "Student courses loaded.");
  }

  async function loadContent() {
    const result = await apiRequest(`/courses/${courseCode}/content?user_id=${user.user_id}`);

    if (result.ok) {
      setContent(result.data);
    }

    show(result, "Course content loaded.");
  }

  async function submitAssignment() {
    const result = await apiRequest(`/assignments/${assignmentId}/submit`, {
      method: "POST",
      body: JSON.stringify({
        student_id: Number(user.user_id),
        file_url: fileUrl,
      }),
    });

    show(result, "Assignment submitted.");
  }

  async function loadStudentEvents() {
  const result = await apiRequest(`/students/${user.user_id}/calendar-events`);

  if (result.ok) {
    setEvents(result.data);
  }

  show(result, "Student calendar events loaded.");
}

  async function filterStudentEventsByDate() {
    if (!eventDate) {
      setMessage("Enter a date first.");
      return;
    }

    const result = await apiRequest(
      `/students/${user.user_id}/calendar-events?date=${eventDate}`
    );

    if (result.ok) {
      setEvents(result.data);
    }

    show(result, "Student calendar events filtered by date.");
  }

  async function loadForums() {
    const result = await apiRequest(`/courses/${courseCode}/forums?user_id=${user.user_id}`);

    if (result.ok) {
      setForums(result.data);
    }

    show(result, "Forums loaded.");
  }

  async function loadThreads(selectedForumId = forumId) {
    if (!selectedForumId) {
      setMessage("Select or enter a forum ID first.");
      return;
    }

    const result = await apiRequest(`/forums/${selectedForumId}/threads?user_id=${user.user_id}`);

    if (result.ok) {
      setThreads(result.data);
    }

    show(result, "Threads loaded.");
  }

  async function createThread() {
    if (!forumId) {
      setMessage("Enter a forum ID first.");
      return;
    }

    const result = await apiRequest(`/forums/${forumId}/threads`, {
      method: "POST",
      body: JSON.stringify({
        user_id: Number(user.user_id),
        title: threadTitle,
        content: threadContent,
      }),
    });

    show(result, "Thread created.");

    if (result.ok) {
      loadThreads();
    }
  }

  async function loadReplies() {
    if (!threadId) {
      setMessage("Enter a thread ID first.");
      return;
    }

    const result = await apiRequest(`/threads/${threadId}/replies?user_id=${user.user_id}`);

    if (result.ok) {
      setReplies(result.data);
    }

    show(result, "Replies loaded.");
  }

  async function addReply() {
    if (!threadId) {
      setMessage("Enter a thread ID first.");
      return;
    }

    const result = await apiRequest(`/threads/${threadId}/replies`, {
      method: "POST",
      body: JSON.stringify({
        user_id: Number(user.user_id),
        content: replyContent,
        parent_reply_id: null,
      }),
    });

    show(result, "Reply added.");

    if (result.ok) {
      loadReplies();
    }
  }

  return (
    <Layout
      title="Student Portal"
      user={user}
      activePage={activePage}
      setActivePage={handlePageChange}
      navItems={navItems}
      message={message}
      onLogout={onLogout}
    >
      {activePage === "dashboard" && <StudentDashboard user={user} />}

      {activePage === "courses" && (
        <StudentCourses courses={courses} loadMyCourses={loadMyCourses} />
      )}

      {activePage === "content" && (
        <StudentContent
          courseCode={courseCode}
          setCourseCode={setCourseCode}
          content={content}
          loadContent={loadContent}
        />
      )}

      {activePage === "assignments" && (
        <StudentAssignments
          user={user}
          assignmentId={assignmentId}
          setAssignmentId={setAssignmentId}
          fileUrl={fileUrl}
          setFileUrl={setFileUrl}
          submitAssignment={submitAssignment}
        />
      )}

      {activePage === "calendar" && (
        <StudentCalendar
          eventDate={eventDate}
          setEventDate={setEventDate}
          events={events}
          loadStudentEvents={loadStudentEvents}
          filterStudentEventsByDate={filterStudentEventsByDate}
        />
      )}

      {activePage === "forums" && (
        <ForumTools
          courseCode={courseCode}
          setCourseCode={setCourseCode}
          forumId={forumId}
          setForumId={setForumId}
          threadId={threadId}
          setThreadId={setThreadId}
          forums={forums}
          threads={threads}
          replies={replies}
          loadForums={loadForums}
          loadThreads={loadThreads}
          createThread={createThread}
          loadReplies={loadReplies}
          addReply={addReply}
          threadTitle={threadTitle}
          setThreadTitle={setThreadTitle}
          threadContent={threadContent}
          setThreadContent={setThreadContent}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
        />
      )}
    </Layout>
  );
}
