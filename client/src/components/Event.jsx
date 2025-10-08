import React, { useState, useEffect } from "react";
import "../css/Event.css";
import {
  toDate,
  formatTime,
  formatRemainingTime,
  formatNegativeTimeRemaining,
} from "../utils/dates";

const Event = ({ event }) => {
  const [time, setTime] = useState("");
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!event) return;

    try {
      // Format readable time (e.g., "2:00 PM")
      const t = formatTime(event.time);
      setTime(t);

      // Combine date + time to calculate remaining time
      const dateObj = toDate(event.date, event.time);
      const r = formatRemainingTime(dateObj);
      setRemaining(r);

      // Style event based on whether it has passed
      formatNegativeTimeRemaining(r, event.id);
    } catch (err) {
      console.error("Event formatting error:", err);
    }
  }, [event]);

  return (
    <article className="event-information">
      <img src={event.image} />

      <div className="event-information-overlay">
        <div className="text">
          <h3>{event.title}</h3>
          <p>
            <i className="fa-regular fa-calendar fa-bounce"></i> {event.date}
            <br /> {time}
          </p>
          <p id={`remaining-${event.id}`}>{remaining}</p>
        </div>
      </div>
    </article>
  );
};

export default Event;
