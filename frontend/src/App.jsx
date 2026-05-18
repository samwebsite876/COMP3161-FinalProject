import React, { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import StudentPortal from "./pages/student/Student";
import LecturerPortal from "./pages/lecturer/Lecturer";
import AdminPortal from "./pages/admin/Admin";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  function logout() {
    setCurrentUser(null);
  }

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  if (currentUser.user_type === "student") {
    return <StudentPortal user={currentUser} onLogout={logout} />;
  }

  if (currentUser.user_type === "lecturer") {
    return <LecturerPortal user={currentUser} onLogout={logout} />;
  }

  return <AdminPortal user={currentUser} onLogout={logout} />;
}
