import React from "react";

export default function Layout({
  title,
  user,
  activePage,
  setActivePage,
  navItems,
  message,
  onLogout,
  children,
}) {
  const pageTitle = navItems.find(([key]) => key === activePage)?.[1] || title;

  return (
    <div className={`app ${user.user_type}Shell`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brandIcon">U</div>
          <div>
            <h2>UniVLE</h2>
            <p>{title}</p>
          </div>
        </div>

        <nav>
          {navItems.map(([key, label]) => (
            <button
              key={key}
              className={activePage === key ? "navItem active" : "navItem"}
              onClick={() => setActivePage(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <button className="logoutBtn" onClick={onLogout}>
          Logout
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="pageLabel">COMP3161 Final Project</p>
            <h1>{pageTitle}</h1>
          </div>

          <div className="userBadge">
            {user.username} | {user.user_type} | ID: {user.user_id}
          </div>
        </header>

        {message && <div className="alert">{message}</div>}
        {children}
      </main>
    </div>
  );
}
