import React, { useState } from "react";
import { apiRequest } from "../api/apiClient";
import { SelectField, TextField } from "../components/Common";

function normalizeRole(role) {
  const cleanRole = String(role || "").toLowerCase();

  if (cleanRole === "admin") return "sysadmin";
  if (["sysadmin", "lecturer", "student"].includes(cleanRole)) {
    return cleanRole;
  }

  return "student";
}

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("student");

  async function handleLogin(event) {
    event.preventDefault();

    const result = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({
        user_id: Number(userId),
        password,
      }),
    });

    if (!result.ok) {
      setMessage(result.data.error || "Login failed.");
      return;
    }

    if (result.data.token) {
      localStorage.setItem("token", result.data.token);
    }

    const userData = result.data.user || result.data;
    const loggedInUser = {
      user_id: userData.user_id || userData.id,
      username: userData.username || String(userData.user_id || userId),
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      email: userData.email || "",
      user_type: normalizeRole(userData.user_type || userData.role),
    };

    localStorage.setItem("user", JSON.stringify(loggedInUser));
    onLogin(loggedInUser);
  }

  async function handleRegister(event) {
    event.preventDefault();

    const result = await apiRequest("/register", {
      method: "POST",
      body: JSON.stringify({
        user_id: Number(userId),
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        user_type: userType,
      }),
    });

    if (!result.ok) {
      setMessage(result.data.error || "Account creation failed.");
      return;
    }

    setMessage(result.data.message || "Account created. Log in with your User ID and password.");
    setMode("login");
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="brand loginBrand">
          <div className="brandIcon">U</div>
          <div>
            <h2>UniVLE</h2>
            <p>Course Management</p>
          </div>
        </div>

        <h1>{mode === "login" ? "Login" : "Create Account"}</h1>
        <p className="loginText">
          {mode === "login"
            ? "Enter your User ID and password."
            : "Students and lecturers can create their own accounts."}
        </p>
        {message && <div className="alert">{message}</div>}

        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="loginForm">
          <TextField label="User ID" value={userId} setValue={setUserId} type="number" />

          {mode === "register" && (
            <>
              <SelectField
                label="Account Type"
                value={userType}
                setValue={setUserType}
                options={[
                  { value: "student", label: "Student" },
                  { value: "lecturer", label: "Lecturer" },
                ]}
              />
              <TextField label="First Name" value={firstName} setValue={setFirstName} />
              <TextField label="Last Name" value={lastName} setValue={setLastName} />
              <TextField label="Email" value={email} setValue={setEmail} type="email" />
            </>
          )}

          <TextField
            label="Password"
            value={password}
            setValue={setPassword}
            type="password"
          />

          <button className="primaryBtn" type="submit">
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        <button
          className="secondaryBtn"
          type="button"
          onClick={() => {
            setMessage("");
            setMode(mode === "login" ? "register" : "login");
          }}
        >
          {mode === "login"
            ? "Create a student/lecturer account"
            : "Back to login"}
        </button>
      </div>
    </div>
  );
}
