import React, { useState } from "react";
import { apiRequest } from "../../api/apiClient";
import ForumTools from "../../components/ForumTools";
import Layout from "../../components/Layout";
import LecturerAssignments from "./LecturerAssignments";
import LecturerCalendar from "./LecturerCalendar";
import LecturerContent from "./LecturerContent";
import LecturerCourses from "./LecturerCourses";
import LecturerDashboard from "./LecturerDashboard";

// ================================
// LECTURER PORTAL LOGIC
// Lecturers manage assigned courses only.
// For protected actions, the logged-in lecturer ID is used automatically:
// uploaded_by, created_by, and graded_by = user.user_id.
// ================================
export default function LecturerPortal({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [message, setMessage] = useState("");

  const [courseCode, setCourseCode] = useState("");
  const [courses, setCourses] = useState([]);
  const [members, setMembers] = useState(null);
  const [content, setContent] = useState([]);
  const [events, setEvents] = useState([]);
  const [forums, setForums] = useState([]);
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);

  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [contentType, setContentType] = useState("");
  const [contentUrl, setContentUrl] = useState("",);

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("",);
  const [dueDate, setDueDate] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [grade, setGrade] = useState("");

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [forumId, setForumId] = useState("");
  const [threadId, setThreadId] = useState("");
  const [forumTitle, setForumTitle] = useState("");
  const [forumDescription, setForumDescription] = useState("");
  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState("");
  const [replyContent, setReplyContent] = useState("");

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
    const result = await apiRequest(`/courses/lecturer/${user.user_id}`);

    if (result.ok) {
      setCourses(result.data);
    }

    show(result, "Lecturer courses loaded.");
  }

  async function loadMembers() {
    const result = await apiRequest(`/courses/${courseCode}/members`);

    if (result.ok) {
      setMembers(result.data);
    }

    show(result, "Course members loaded.");
  }

  async function addSection() {
    const result = await apiRequest(`/courses/${courseCode}/sections`, {
      method: "POST",
      body: JSON.stringify({
        title: sectionTitle,
        created_by: Number(user.user_id),
      }),
    });

    if (result.ok && result.data.section_id) {
      setSectionId(String(result.data.section_id));
    }

    show(result, "Section created.");
  }

  async function addContent() {
    const result = await apiRequest(`/sections/${sectionId}/content`, {
      method: "POST",
      body: JSON.stringify({
        title: contentTitle,
        content_type: contentType,
        content_url: contentUrl,
        uploaded_by: Number(user.user_id),
      }),
    });

    show(result, "Content added.");
  }

  async function loadContent() {
    const result = await apiRequest(`/courses/${courseCode}/content?user_id=${user.user_id}`);

    if (result.ok) {
      setContent(result.data);
    }

    show(result, "Content loaded.");
  }

  async function createAssignment() {
    const result = await apiRequest(`/courses/${courseCode}/assignments`, {
      method: "POST",
      body: JSON.stringify({
        title: assignmentTitle,
        description: assignmentDescription,
        due_date: dueDate,
        created_by: Number(user.user_id),
      }),
    });

    show(result, "Assignment created.");
  }

  async function gradeSubmission() {
    const result = await apiRequest(`/submissions/${submissionId}/grade`, {
      method: "POST",
      body: JSON.stringify({
        grade: Number(grade),
        graded_by: Number(user.user_id),
      }),
    });

    show(result, "Submission graded.");
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
        created_by: Number(user.user_id),
      }),
    });

    show(result, "Calendar event created.");
  }

  async function loadCalendarEvents() {
    const result = await apiRequest(`/courses/${courseCode}/calendar-events?user_id=${user.user_id}`);

    if (result.ok) {
      setEvents(result.data);
    }

    show(result, "Events loaded.");
  }

  async function createForum() {
    const result = await apiRequest(`/courses/${courseCode}/forums`, {
      method: "POST",
      body: JSON.stringify({
        title: forumTitle,
        description: forumDescription,
        created_by: Number(user.user_id),
      }),
    });

    show(result, "Forum created.");
  }

  async function loadForums() {
    const result = await apiRequest(`/courses/${courseCode}/forums?user_id=${user.user_id}`);

    if (result.ok) {
      setForums(result.data);
    }

    show(result, "Forums loaded.");
  }

  async function createThread() {
    const result = await apiRequest(`/forums/${forumId}/threads`, {
      method: "POST",
      body: JSON.stringify({
        user_id: Number(user.user_id),
        title: threadTitle,
        content: threadContent,
      }),
    });

    show(result, "Thread created.");
  }

  async function loadThreads() {
    const result = await apiRequest(`/forums/${forumId}/threads?user_id=${user.user_id}`);

    if (result.ok) {
      setThreads(result.data);
    }

    show(result, "Threads loaded.");
  }

  async function addReply() {
    const result = await apiRequest(`/threads/${threadId}/replies`, {
      method: "POST",
      body: JSON.stringify({
        user_id: Number(user.user_id),
        content: replyContent,
        parent_reply_id: null,
      }),
    });

    show(result, "Reply added.");
  }

  async function loadReplies() {
    const result = await apiRequest(`/threads/${threadId}/replies?user_id=${user.user_id}`);

    if (result.ok) {
      setReplies(result.data);
    }

    show(result, "Replies loaded.");
  }

  return (
    <Layout
      title="Lecturer Portal"
      user={user}
      activePage={activePage}
      setActivePage={handlePageChange}
      navItems={navItems}
      message={message}
      onLogout={onLogout}
    >
      {activePage === "dashboard" && <LecturerDashboard user={user} />}

      {activePage === "courses" && (
        <LecturerCourses courses={courses} loadMyCourses={loadMyCourses} />
      )}

      {activePage === "content" && (
        <LecturerContent
          user={user}
          courseCode={courseCode}
          setCourseCode={setCourseCode}
          sectionTitle={sectionTitle}
          setSectionTitle={setSectionTitle}
          sectionId={sectionId}
          setSectionId={setSectionId}
          contentTitle={contentTitle}
          setContentTitle={setContentTitle}
          contentType={contentType}
          setContentType={setContentType}
          contentUrl={contentUrl}
          setContentUrl={setContentUrl}
          content={content}
          addSection={addSection}
          addContent={addContent}
          loadContent={loadContent}
        />
      )}

      {activePage === "assignments" && (
        <LecturerAssignments
          courseCode={courseCode}
          setCourseCode={setCourseCode}
          assignmentTitle={assignmentTitle}
          setAssignmentTitle={setAssignmentTitle}
          assignmentDescription={assignmentDescription}
          setAssignmentDescription={setAssignmentDescription}
          dueDate={dueDate}
          setDueDate={setDueDate}
          submissionId={submissionId}
          setSubmissionId={setSubmissionId}
          grade={grade}
          setGrade={setGrade}
          createAssignment={createAssignment}
          gradeSubmission={gradeSubmission}
        />
      )}

      {activePage === "calendar" && (
        <LecturerCalendar
          courseCode={courseCode}
          setCourseCode={setCourseCode}
          eventTitle={eventTitle}
          setEventTitle={setEventTitle}
          eventDescription={eventDescription}
          setEventDescription={setEventDescription}
          eventDate={eventDate}
          setEventDate={setEventDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          events={events}
          createCalendarEvent={createCalendarEvent}
          loadCalendarEvents={loadCalendarEvents}
        />
      )}

      {activePage === "forums" && (
        <ForumTools
          forumTitle={forumTitle}
          setForumTitle={setForumTitle}
          forumDescription={forumDescription}
          setForumDescription={setForumDescription}
          createForum={createForum}
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


