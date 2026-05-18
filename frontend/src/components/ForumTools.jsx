import React from "react";
import { RecordCards, TextField } from "./Common";

export default function ForumTools({
  isLecturer = false,
  forumTitle,
  setForumTitle,
  forumDescription,
  setForumDescription,
  createForum,
  courseCode,
  setCourseCode,
  selectedForum,
  selectedThread,
  forums,
  threads,
  replies,
  loadForums,
  selectForum,
  createThread,
  selectThread,
  addReply,
  threadTitle,
  setThreadTitle,
  threadContent,
  setThreadContent,
  replyContent,
  setReplyContent,
}) {
  return (
    <section className="page">
      <div className="sectionHeader">
        <div>
          <h2>Course Forums</h2>
          <p>
            Load forums, choose a forum, open its threads, then select a thread
            to read and reply. No manual forum or thread IDs needed.
          </p>
        </div>
      </div>

      <div className="forumFlowLayout">
        <div className="panel actionCard">
          <h2>1. Choose Course</h2>

          <TextField
            label="Course Code"
            value={courseCode}
            setValue={setCourseCode}
          />

          {isLecturer && (
            <div className="forumCreateBox">
              <h3>Create Forum</h3>

              <TextField
                label="Forum Title"
                value={forumTitle}
                setValue={setForumTitle}
              />

              <TextField
                label="Forum Description"
                value={forumDescription}
                setValue={setForumDescription}
              />

              <button className="secondaryBtn" onClick={createForum}>
                Create Forum
              </button>
            </div>
          )}

          <button className="primaryBtn" onClick={loadForums}>
            Load Forums
          </button>
        </div>

        <div className="panel actionCard">
          <h2>2. Select Forum</h2>

          <div className="selectableCardGrid">
            {forums && forums.length > 0 ? (
              forums.map((forum) => (
                <button
                  type="button"
                  key={forum.forum_id}
                  className={
                    selectedForum?.forum_id === forum.forum_id
                      ? "selectableCard selectedCard"
                      : "selectableCard"
                  }
                  onClick={() => selectForum(forum)}
                >
                  <strong>{forum.title || `Forum ${forum.forum_id}`}</strong>
                  <span>{forum.description || "No description provided."}</span>
                </button>
              ))
            ) : (
              <div className="emptyState">No forums loaded yet.</div>
            )}
          </div>
        </div>

        <div className="panel actionCard">
          <h2>3. Create Thread</h2>

          <div className="selectedBox">
            <span>Selected Forum</span>
            <strong>
              {selectedForum
                ? selectedForum.title || `Forum ${selectedForum.forum_id}`
                : "Choose a forum first"}
            </strong>
          </div>

          <TextField
            label="Thread Title"
            value={threadTitle}
            setValue={setThreadTitle}
          />

          <TextField
            label="Thread Content"
            value={threadContent}
            setValue={setThreadContent}
          />

          <button className="secondaryBtn" onClick={createThread}>
            Create Thread
          </button>
        </div>

        <div className="panel actionCard">
          <h2>4. Select Thread</h2>

          <div className="selectableCardGrid">
            {threads && threads.length > 0 ? (
              threads.map((thread) => (
                <button
                  type="button"
                  key={thread.thread_id}
                  className={
                    selectedThread?.thread_id === thread.thread_id
                      ? "selectableCard selectedCard"
                      : "selectableCard"
                  }
                  onClick={() => selectThread(thread)}
                >
                  <strong>{thread.title || `Thread ${thread.thread_id}`}</strong>
                  <span>{thread.content || "No content provided."}</span>
                </button>
              ))
            ) : (
              <div className="emptyState">
                Select a forum to load its threads.
              </div>
            )}
          </div>
        </div>

        <div className="panel actionCard">
          <h2>5. Replies</h2>

          <div className="selectedBox">
            <span>Selected Thread</span>
            <strong>
              {selectedThread
                ? selectedThread.title || `Thread ${selectedThread.thread_id}`
                : "Choose a thread first"}
            </strong>
          </div>

          <TextField
            label="Reply Content"
            value={replyContent}
            setValue={setReplyContent}
          />

          <button className="secondaryBtn" onClick={addReply}>
            Add Reply
          </button>

          <div className="embeddedResults">
            <h3>Replies</h3>
            <RecordCards data={replies} />
          </div>
        </div>
      </div>
    </section>
  );
}
