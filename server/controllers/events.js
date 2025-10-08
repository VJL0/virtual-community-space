import { pool } from "../config/database.js";

const getEvents = async (req, res) => {
  // optional query param: locationId
  const { locationId } = req.query;
  try {
    let result;
    if (locationId) {
      result = await pool.query(
        "SELECT * FROM events WHERE location_id = $1 ORDER BY date, time",
        [locationId]
      );
    } else {
      result = await pool.query("SELECT * FROM events ORDER BY date, time");
    }
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to get events" });
  }
};

const getEventById = async (req, res) => {
  const id = req.params.eventId;
  try {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Event not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to get event" });
  }
};

export default {
  getEvents,
  getEventById,
};
