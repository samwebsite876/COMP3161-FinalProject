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
// JWT handles identity. The frontend no longer sends uploaded_by,
// created_by, graded_by, lecturer_id, or user_id in protected requests.
// ================================
export default function LecturerPortal({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [message, setMessage] = useState("");

  const [courseCode, setCourseCode] = useState("");
  const [courses, setCourses] = useState([]);
  const [content, setContent] = useState([]);
  const [events, setEvents] = useState([]);
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);

  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [contentType, setContentType] = useState("");
  const [contentUrl, setContentUrl] = useState("");

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState("");

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

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

  async function addSection() {
    const result = await apiRequest(`/courses/${courseCode}/sections`, {
      method: "POST",
      body: JSON.stringify({
        title: sectionTitle,
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
      }),
    });

    show(result, "Content added.");
  }

  async function loadContent() {
    const result = await apiRequest(`/courses/${courseCode}/content`);

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
      }),
    });

    show(result, "Assignment created.");
  }

  async function loadSubmissions() {
    if (!courseCode) {
      setMessage("Enter a course code first.");
      return;
    }

    const result = await apiRequest(`/courses/${courseCode}/submissions`);

    if (result.ok) {
      setSubmissions(result.data);
      setSelectedSubmission(null);
    }

    show(result, "Submissions loaded.");
  }

  function selectSubmission(submission) {
    setSelectedSubmission(submission);
    setMessage("");
  }

  async function gradeSubmission() {
    if (!selectedSubmission) {
      setMessage("Choose a submission first.");
      return;
    }

    const result = await apiRequest(
      `/submissions/${selectedSubmission.submission_id}/grade`,
      {
        method: "POST",
        body: JSON.stringify({
          grade: Number(grade),
        }),
      },
    );

    show(result, "Submission graded.");

    if (result.ok) {
      loadSubmissions();
    }
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
      }),
    });

    show(result, "Calendar event created.");
  }

  async function loadCalendarEvents() {
    const result = await apiRequest(`/courses/${courseCode}/calendar-events`);

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
      }),
    });

    show(result, "Forum created.");

    if (result.ok) {
      setForumTitle("");
      setForumDescription("");
      loadForums();
    }
  }

  async function loadForums() {
    const result = await apiRequest(`/courses/${courseCode}/forums`);

    if (result.ok) {
      setForums(result.data);
      setSelectedForum(null);
      setSelectedThread(null);
      setThreads([]);
      setReplies([]);
    }

    show(result, "Forums loaded.");
  }

  async function loadThreads(forumIdToLoad) {
    const id = forumIdToLoad || selectedForum?.forum_id;

    if (!id) {
      setMessage("Choose a forum first.");
      return;
    }

    const result = await apiRequest(`/forums/${id}/threads`);

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

    const result = await apiRequest(`/threads/${id}/replies`);

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
          submissions={submissions}
          selectedSubmission={selectedSubmission}
          selectSubmission={selectSubmission}
          grade={grade}
          setGrade={setGrade}
          createAssignment={createAssignment}
          loadSubmissions={loadSubmissions}
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
          isLecturer={true}
          forumTitle={forumTitle}
          setForumTitle={setForumTitle}
          forumDescription={forumDescription}
          setForumDescription={setForumDescription}
          createForum={createForum}
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
