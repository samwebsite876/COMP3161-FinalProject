import React from "react";
import { RecordCards, TextField } from "../../components/Common";

export default function StudentCalendar({
  eventDate,
  setEventDate,
  events,
  loadStudentEvents,
  filterStudentEventsByDate,
}) {
  return (
    <section className="page">
      <div className="calendarSingleCard">
        <div className="panel actionCard">
          <h2>My Calendar</h2>
          <p>
            View all calendar events for your registered courses, or filter by a
            specific date.
          </p>

          <div className="studentCalendarControls">
            <div className="studentDateField">
              <TextField
                label="Filter by Date"
                value={eventDate}
                setValue={setEventDate}
              />
            </div>

            <div className="calendarButtonRow">
              <button className="primaryBtn" onClick={loadStudentEvents}>
                Load All Events
              </button>

              <button
                className="secondaryBtn"
                onClick={filterStudentEventsByDate}
              >
                Filter by Date
              </button>
            </div>
          </div>

          <div className="embeddedResults">
            <h3>Calendar Events</h3>
            <RecordCards data={events} />
          </div>
        </div>
      </div>
    </section>
  );
}
