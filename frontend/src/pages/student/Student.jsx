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
  const [fileUrl, setFileUrl] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [selectedForum, setSelectedForum] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState("",);
  const [replyContent, setReplyContent] = useState("");

  const [courses, setCourses] = useState([]);
  const [content, setContent] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
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

  async function loadAssignments() {
    if (!courseCode) {
      setMessage("Enter a course code first.");
      return;
    }

    const result = await apiRequest(
      `/courses/${courseCode}/assignments?user_id=${user.user_id}`,
    );

    if (result.ok) {
      setAssignments(result.data);
      setSelectedAssignment(null);
    }

    show(result, "Assignments loaded.");
  }

  function selectAssignment(assignment) {
    setSelectedAssignment(assignment);
    setMessage("");
  }

  async function submitAssignment() {
    if (!selectedAssignment) {
      setMessage("Choose an assignment first.");
      return;
    }

    const result = await apiRequest(
      `/assignments/${selectedAssignment.assignment_id}/submit`,
      {
        method: "POST",
        body: JSON.stringify({
          student_id: Number(user.user_id),
          file_url: fileUrl,
        }),
      },
    );

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

  async function loadThreads(forumIdToLoad) {
    const id = forumIdToLoad || selectedForum?.forum_id;

    if (!id) {
      setMessage("Choose a forum first.");
      return;
    }

    const result = await apiRequest(
      `/forums/${id}/threads?user_id=${user.user_id}`,
    );

    if (result.ok) {
      setThreads(result.data);
      setSelectedThread(null);
      setReplies([]);
    }

    show(result, "Threads loaded.");
  }

  function selectForum(forum) {
    setSelectedForum(forum);
    setMessage("");
    loadThreads(forum.forum_id);
  }

  async function createThread() {
    if (!selectedForum) {
      setMessage("Choose a forum first.");
      return;
    }

    const result = await apiRequest(`/forums/${selectedForum.forum_id}/threads`, {
      method: "POST",
      body: JSON.stringify({
        user_id: Number(user.user_id),
        title: threadTitle,
        content: threadContent,
      }),
    });

    show(result, "Thread created.");

    if (result.ok) {
      setThreadTitle("");
      setThreadContent("");
      loadThreads(selectedForum.forum_id);
    }
  }

  async function loadReplies(threadIdToLoad) {
    const id = threadIdToLoad || selectedThread?.thread_id;

    if (!id) {
      setMessage("Choose a thread first.");
      return;
    }

    const result = await apiRequest(
      `/threads/${id}/replies?user_id=${user.user_id}`,
    );

    if (result.ok) {
      setReplies(result.data);
    }

    show(result, "Replies loaded.");
  }

  function selectThread(thread) {
    setSelectedThread(thread);
    setMessage("");
    loadReplies(thread.thread_id);
  }

  async function addReply() {
    if (!selectedThread) {
      setMessage("Choose a thread first.");
      return;
    }

    const result = await apiRequest(`/threads/${selectedThread.thread_id}/replies`, {
      method: "POST",
      body: JSON.stringify({
        user_id: Number(user.user_id),
        content: replyContent,
        parent_reply_id: null,
      }),
    });

    show(result, "Reply added.");

    if (result.ok) {
      setReplyContent("");
      loadReplies(selectedThread.thread_id);
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
          courseCode={courseCode}
          setCourseCode={setCourseCode}
          assignments={assignments}
          selectedAssignment={selectedAssignment}
          selectAssignment={selectAssignment}
          fileUrl={fileUrl}
          setFileUrl={setFileUrl}
          loadAssignments={loadAssignments}
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
          selectedForum={selectedForum}
          selectedThread={selectedThread}
          forums={forums}
          threads={threads}
          replies={replies}
          loadForums={loadForums}
          loadThreads={loadThreads}
          selectForum={selectForum}
          createThread={createThread}
          selectThread={selectThread}
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
