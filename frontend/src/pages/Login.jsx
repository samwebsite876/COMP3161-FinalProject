import React, { useState } from "react";
import { apiRequest } from "../api/apiClient";
import { SelectField, TextField } from "../components/Common";

function normalizeRole(role, fallback) {
  const cleanRole = String(role || "").toLowerCase();

  if (cleanRole === "admin") return "sysadmin";
  if (["sysadmin", "lecturer", "student"].includes(cleanRole)) {
    return cleanRole;
  }

  return fallback;
}

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    const result = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({
        username: username.trim(),
        password,
      }),
    });

    if (!result.ok) {
      setMessage(result.data.error || "Login failed.");
      return;
    }

    const userData = result.data.user || result.data;
    const role = normalizeRole(
      userData.user_type || userData.role,
      selectedRole,
    );

    onLogin({
      user_id: userData.user_id || userData.id,
      username: userData.username || username,
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      user_type: role,
    });
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

        <h1>Login</h1>
        <p className="loginText">Enter your correct credentials:</p>
        {message && <div className="alert">{message}</div>}

        <form onSubmit={handleLogin} className="loginForm">
          <TextField label="Username" value={username} setValue={setUsername} />
          <TextField
            label="Password"
            value={password}
            setValue={setPassword}
            type="password"
          />
          <SelectField
            label="Select User"
            value={selectedRole}
            setValue={setSelectedRole}
            options={[
              { value: "sysadmin", label: "Admin" },
              { value: "lecturer", label: "Lecturer" },
              { value: "student", label: "Student" },
            ]}
          />
          <button className="primaryBtn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
