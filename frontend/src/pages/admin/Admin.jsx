import React, { useState } from "react";
import { apiRequest } from "../../api/apiClient";
import Layout from "../../components/Layout";
import AdminCourses from "./AdminCourses";
import AdminDashboard from "./AdminDashboard";
import AdminMembers from "./AdminMembers";
import AdminReports from "./AdminReports";
import AdminUsers from "./AdminUsers";
import { LecturerCourseLookup, StudentCourseLookup } from "./AdminLookups";

// ================================
// ADMIN PORTAL LOGIC
// Admins manage users, courses, registration, members, and report views.
// The logged-in admin user_id is used as created_by when creating courses.
// ================================
export default function AdminPortal({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [message, setMessage] = useState("");

  const [courses, setCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);
  const [lecturerCourses, setLecturerCourses] = useState([]);
  const [members, setMembers] = useState(null);
  const [reportTitle, setReportTitle] = useState("");
  const [reportData, setReportData] = useState([]);

  const [registerUserId, setRegisterUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [assignedLecturer, setAssignedLecturer] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [studentId, setStudentId] = useState("");
  const [lecturerId, setLecturerId] = useState("");

  const navItems = [
    ["dashboard", "Dashboard"],
    ["users", "User Access"],
    ["courses", "Courses"],
    ["studentLookup", "Student Courses"],
    ["lecturerLookup", "Lecturer Courses"],
    ["members", "Registration & Members"],
    ["reports", "Reports"],
  ];

  function show(result, fallback) {
    setMessage(result.data.message || result.data.error || fallback);
  }

  function handlePageChange(page) {
    setMessage("");
    setActivePage(page);
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
        user_type: userType,
      }),
    });

    show(result, "User registration completed.");
  }

  async function createCourse() {
    const result = await apiRequest("/courses", {
      method: "POST",
      body: JSON.stringify({
        created_by: Number(user.user_id),
        course_code: newCourseCode,
        title: newCourseTitle,
        assigned_lecturer: Number(assignedLecturer),
      }),
    });

    show(result, "Course created.");

    if (result.ok) {
      loadCourses();
    }
  }

  async function loadCourses() {
    const result = await apiRequest("/courses");

    if (result.ok) {
      setCourses(result.data);
    }

    show(result, "Courses loaded.");
  }

  async function loadStudentCourses() {
    const result = await apiRequest(`/courses/student/${studentId}`);

    if (result.ok) {
      setStudentCourses(result.data);
    }

    show(result, "Student courses loaded.");
  }

  async function loadLecturerCourses() {
    const result = await apiRequest(`/courses/lecturer/${lecturerId}`);

    if (result.ok) {
      setLecturerCourses(result.data);
    }

    show(result, "Lecturer courses loaded.");
  }

  async function registerStudentForCourse() {
    const result = await apiRequest(`/courses/${courseCode}/register`, {
      method: "POST",
      body: JSON.stringify({
        student_id: Number(studentId),
      }),
    });

    show(result, "Student registration completed.");
  }

  async function loadMembers() {
    const result = await apiRequest(`/courses/${courseCode}/members`);

    if (result.ok) {
      setMembers(result.data);
    }

    show(result, "Course members loaded.");
  }

  async function loadReport(title, path) {
    const result = await apiRequest(path);

    if (result.ok) {
      setReportTitle(title);
      setReportData(result.data);
    }

    show(result, `${title} loaded.`);
  }

  return (
    <Layout
      title="Admin Portal"
      user={user}
      activePage={activePage}
      setActivePage={handlePageChange}
      navItems={navItems}
      message={message}
      onLogout={onLogout}
    >
      {activePage === "dashboard" && <AdminDashboard user={user} />}

      {activePage === "users" && (
        <AdminUsers
          registerUserId={registerUserId}
          setRegisterUserId={setRegisterUserId}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          userType={userType}
          setUserType={setUserType}
          registerUser={registerUser}
        />
      )}

      {activePage === "courses" && (
        <AdminCourses
          user={user}
          courses={courses}
          newCourseCode={newCourseCode}
          setNewCourseCode={setNewCourseCode}
          newCourseTitle={newCourseTitle}
          setNewCourseTitle={setNewCourseTitle}
          assignedLecturer={assignedLecturer}
          setAssignedLecturer={setAssignedLecturer}
          createCourse={createCourse}
          loadCourses={loadCourses}
        />
      )}

      {activePage === "studentLookup" && (
        <StudentCourseLookup
          studentId={studentId}
          setStudentId={setStudentId}
          studentCourses={studentCourses}
          loadStudentCourses={loadStudentCourses}
        />
      )}

      {activePage === "lecturerLookup" && (
        <LecturerCourseLookup
          lecturerId={lecturerId}
          setLecturerId={setLecturerId}
          lecturerCourses={lecturerCourses}
          loadLecturerCourses={loadLecturerCourses}
        />
      )}

      {activePage === "members" && (
        <AdminMembers
          courseCode={courseCode}
          setCourseCode={setCourseCode}
          studentId={studentId}
          setStudentId={setStudentId}
          members={members}
          registerStudentForCourse={registerStudentForCourse}
          loadMembers={loadMembers}
        />
      )}

      {activePage === "reports" && (
        <AdminReports
          reportTitle={reportTitle}
          reportData={reportData}
          loadReport={loadReport}
        />
      )}
    </Layout>
  );
}