import React from "react";
import { RecordCards, SelectField, TextField } from "../../components/Common";

export default function AdminUserAccess({
  newUserId,
  setNewUserId,
  newFirstName,
  setNewFirstName,
  newLastName,
  setNewLastName,
  newEmail,
  setNewEmail,
  newPassword,
  setNewPassword,
  newUserType,
  setNewUserType,
  users,
  createUser,
  loadUsers,
}) {
  return (
    <section className="page">
      <div className="panel actionCard lookupSingleCard">
        <div className="sectionIntro">
          <h2>User Access</h2>
          <p>
            Create user accounts with all required fields. Login uses User ID and
            password; the username is automatically saved as the same value as
            the User ID for database compatibility.
          </p>
        </div>

        <div className="adminCoursesLayout">
          <div className="adminCoursesCard">
            <h3>Create User</h3>

            <TextField
              label="User ID"
              value={newUserId}
              setValue={setNewUserId}
              type="number"
            />

            <TextField
              label="First Name"
              value={newFirstName}
              setValue={setNewFirstName}
            />

            <TextField
              label="Last Name"
              value={newLastName}
              setValue={setNewLastName}
            />

            <TextField
              label="Email"
              value={newEmail}
              setValue={setNewEmail}
              type="email"
            />

            <TextField
              label="Password"
              value={newPassword}
              setValue={setNewPassword}
              type="password"
            />

            <SelectField
              label="User Type"
              value={newUserType}
              setValue={setNewUserType}
              options={[
                { value: "student", label: "Student" },
                { value: "lecturer", label: "Lecturer" },
                { value: "sysadmin", label: "Sysadmin" },
              ]}
            />

            <button className="secondaryBtn" onClick={createUser}>
              Create User
            </button>
          </div>

          <div className="adminCoursesCard">
            <h3>All Users</h3>
            <p>Load users to confirm the account was created successfully.</p>

            <button className="primaryBtn" onClick={loadUsers}>
              Load Users
            </button>
          </div>
        </div>

        <div className="embeddedResults">
          <h3>Loaded Users</h3>
          <RecordCards data={users} />
        </div>
      </div>
    </section>
  );
}
