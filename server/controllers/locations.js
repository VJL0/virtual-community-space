import { pool } from "../config/database.js";

const getLocations = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM locations ORDER BY id");
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to get locations" });
  }
};

const getLocationById = async (req, res) => {
  const id = req.params.locationId;
  try {
    const result = await pool.query("SELECT * FROM locations WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Location not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to get location" });
  }
};

export default {
  getLocations,
  getLocationById,
};
