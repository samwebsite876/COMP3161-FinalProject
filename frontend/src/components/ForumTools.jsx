import React from "react";
import { RecordCards, TextField } from "./Common";

export default function ForumTools({
  forumTitle,
  setForumTitle,
  forumDescription,
  setForumDescription,
  createForum,
  courseCode,
  setCourseCode,
  forumId,
  setForumId,
  threadId,
  setThreadId,
  forums,
  threads,
  replies,
  loadForums,
  createThread,
  loadThreads,
  addReply,
  loadReplies,
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
          <p>Create forums, load course forums, start threads, and reply.</p>
        </div>
      </div>

      <div className="forumLayout betterForumLayout">
        {/* ===================================================== */}
        {/* FORUMS */}
        {/* ===================================================== */}

        <div className="panel actionCard">
          <h2>1. Create / Load Forums</h2>

          <div className="forumFormGrid">
            <TextField
              label="Course Code"
              value={courseCode}
              setValue={setCourseCode}
            />

            <TextField
              label="Forum Title"
              value={forumTitle}
              setValue={setForumTitle}
            />

            <div className="fullWidth">
              <TextField
                label="Forum Description"
                value={forumDescription}
                setValue={setForumDescription}
              />
            </div>
          </div>

          <div className="forumButtonRow">
            <button className="secondaryBtn" onClick={createForum}>
              Create Forum
            </button>

            <button className="primaryBtn" onClick={loadForums}>
              Load Forums
            </button>
          </div>

          <div className="embeddedResults">
            <h3>Forums</h3>
            <RecordCards data={forums} />
          </div>
        </div>

        {/* ===================================================== */}
        {/* THREADS */}
        {/* ===================================================== */}

        <div className="panel actionCard">
          <h2>2. Create / Load Threads</h2>

          <div className="forumFormGrid">
            <TextField
              label="Forum ID"
              value={forumId}
              setValue={setForumId}
            />

            <TextField
              label="Thread Title"
              value={threadTitle}
              setValue={setThreadTitle}
            />

            <div className="fullWidth">
              <TextField
                label="Thread Content"
                value={threadContent}
                setValue={setThreadContent}
              />
            </div>
          </div>

          <div className="forumButtonRow">
            <button className="secondaryBtn" onClick={createThread}>
              Create Thread
            </button>

            <button className="primaryBtn" onClick={() => loadThreads()}>
              Load Threads
            </button>
          </div>

          <div className="embeddedResults">
            <h3>Threads</h3>
            <RecordCards data={threads} />
          </div>
        </div>

        {/* ===================================================== */}
        {/* REPLIES */}
        {/* ===================================================== */}

        <div className="panel actionCard">
          <h2>3. Add / Load Replies</h2>

          <div className="forumFormGrid">
            <TextField
              label="Thread ID"
              value={threadId}
              setValue={setThreadId}
            />

            <div className="fullWidth">
              <TextField
                label="Reply Content"
                value={replyContent}
                setValue={setReplyContent}
              />
            </div>
          </div>

          <div className="forumButtonRow">
            <button className="secondaryBtn" onClick={addReply}>
              Add Reply
            </button>

            <button className="primaryBtn" onClick={loadReplies}>
              Load Replies
            </button>
          </div>

          <div className="embeddedResults">
            <h3>Replies</h3>
            <RecordCards data={replies} />
          </div>
        </div>
      </div>
    </section>
  );
}