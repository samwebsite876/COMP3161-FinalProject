import React from "react";
import { SelectField, TextField } from "../../components/Common";

export default function AdminUsers({
  registerUserId,
  setRegisterUserId,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  userType,
  setUserType,
  registerUser,
}) {
  return (
    <section className="page">
      <div className="panel actionCard userFormPanel">
        <div className="sectionIntro">
          <h2>Register User</h2>
          <p>Create student, lecturer, or sysadmin accounts from one form.</p>
        </div>

        <div className="userFormGrid">
          <TextField
            label="User ID"
            value={registerUserId}
            setValue={setRegisterUserId}
          />

          <SelectField
            label="User Type"
            value={userType}
            setValue={setUserType}
            options={[
              { value: "student", label: "student" },
              { value: "lecturer", label: "lecturer" },
              { value: "sysadmin", label: "sysadmin" },
            ]}
          />

          <TextField
            label="First Name"
            value={firstName}
            setValue={setFirstName}
          />

          <TextField
            label="Last Name"
            value={lastName}
            setValue={setLastName}
          />

          <TextField label="Email" value={email} setValue={setEmail} />
          <TextField
            label="Username"
            value={username}
            setValue={setUsername}
          />

          <div className="fullWidth">
            <TextField
              label="Password"
              value={password}
              setValue={setPassword}
              type="password"
            />
          </div>
        </div>

        <div className="centerButtonRow">
          <button className="primaryBtn" onClick={registerUser}>
            Register User
          </button>
        </div>
      </div>
    </section>
  );
}
