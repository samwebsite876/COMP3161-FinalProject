import React from "react";
import { RecordCards, TextField } from "../../components/Common";

export default function LecturerCalendar({
  courseCode,
  setCourseCode,
  eventTitle,
  setEventTitle,
  eventDescription,
  setEventDescription,
  eventDate,
  setEventDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  events,
  createCalendarEvent,
  loadCalendarEvents,
}) {
  return (
    <section className="page">
      <div className="calendarSingleCard">
        <div className="panel actionCard">
          <h2>Create Event</h2>
          <p>Add a calendar event for one of your assigned courses.</p>

          <div className="calendarFormGrid">
            <TextField
              label="Course Code"
              value={courseCode}
              setValue={setCourseCode}
            />

            <TextField
              label="Title"
              value={eventTitle}
              setValue={setEventTitle}
            />

            <TextField
              label="Description"
              value={eventDescription}
              setValue={setEventDescription}
            />

            <TextField
              label="Date"
              value={eventDate}
              setValue={setEventDate}
            />

            <div className="calendarTimeRow">
              <TextField
                label="Start Time"
                value={startTime}
                setValue={setStartTime}
              />

              <TextField
                label="End Time"
                value={endTime}
                setValue={setEndTime}
              />
            </div>
          </div>

          <div className="calendarButtonRow">
            <button className="secondaryBtn" onClick={createCalendarEvent}>
              Create Event
            </button>

            <button className="primaryBtn" onClick={loadCalendarEvents}>
              Load Events
            </button>
          </div>

          <div className="embeddedResults">
            <h3>Course Events</h3>
            <RecordCards data={events} />
          </div>
        </div>
      </div>
    </section>
  );
}