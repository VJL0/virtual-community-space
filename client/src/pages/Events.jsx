import React, { useState, useEffect } from "react";
import Event from "../components/Event";
import LocationsAPI from "../services/LocationsAPI";
import EventsAPI from "../services/EventsAPI";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    (async () => {
      setEvents(await EventsAPI.getAllEvents());
      setLocations(await LocationsAPI.getAllLocations());
    })();
  }, []);

  return (
    <div className="location-events">
      <div
        style={{
          display: "flex",
          padding: "50px",
          gap: "30px",
          maxWidth: "800px",
        }}
      >
        <select
          value={location}
          onChange={async (e) => {
            const selected = e.target.value;
            setLocation(selected);
            if (!selected) {
              setEvents(await EventsAPI.getAllEvents());
            } else {
              setEvents(await EventsAPI.getEventsByLocation(selected));
            }
          }}
        >
          <option value="">See events at...</option>
          {locations &&
            locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
        </select>
        <button
          onClick={async () => {
            setEvents(await EventsAPI.getAllEvents());
            setLocation("");
          }}
        >
          <strong>SHOW ALL EVENTS</strong>
        </button>
      </div>

      <main>
        {events && events.length > 0 ? (
          events.map((event) => <Event key={event.id} event={event} />)
        ) : (
          <h2>
            <i className="fa-regular fa-calendar-xmark fa-shake"></i>{" "}
            {"No events scheduled at this location yet!"}
          </h2>
        )}
      </main>
    </div>
  );
};

export default Events;
