// server/config/reset.js
import { pool } from "./database.js";
import eventData from "../data/events.js";
import locationData from "../data/locations.js";

const initSchema = async () => {
  // Drop child first, then parent. Recreate with a simple, clear schema.
  const sql = `
    BEGIN;

    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS locations;

    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date DATE,
      time TEXT,
      image TEXT,
      location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE
    );

    COMMIT;
  `;
  await pool.query(sql);
  console.log("🎉 schema initialized");
};

const seedLocations = async () => {
  if (!Array.isArray(locationData) || locationData.length === 0) {
    console.log("ℹ️ no locations to seed");
    return;
  }

  // Build a single multi-row INSERT to cut down round-trips.
  const cols = ["id", "name", "address", "city", "state", "zip", "image"];
  const values = [];
  const placeholders = locationData.map((loc, i) => {
    const base = i * cols.length;
    values.push(
      loc.id,
      loc.name,
      loc.address ?? null,
      loc.city ?? null,
      loc.state ?? null,
      loc.zip ?? null,
      loc.image ?? ""
    );
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${
      base + 5
    }, $${base + 6}, $${base + 7})`;
  });

  const sql = `
    INSERT INTO locations (${cols.join(", ")})
    VALUES ${placeholders.join(", ")}
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      address = EXCLUDED.address,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      zip = EXCLUDED.zip,
      image = EXCLUDED.image
  `;
  await pool.query(sql, values);
  console.log("✅ locations seeded");
};

const seedEvents = async () => {
  if (!Array.isArray(eventData) || eventData.length === 0) {
    console.log("ℹ️ no events to seed");
    return;
  }

  const cols = [
    "id",
    "title",
    "description",
    "date",
    "time",
    "image",
    "location_id",
  ];
  const values = [];
  const placeholders = eventData.map((ev, i) => {
    const base = i * cols.length;
    values.push(
      ev.id,
      ev.title,
      ev.description ?? "",
      ev.date ?? null,
      ev.time ?? null,
      ev.image ?? "",
      ev.location_id ?? null
    );
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${
      base + 5
    }, $${base + 6}, $${base + 7})`;
  });

  const sql = `
    INSERT INTO events (${cols.join(", ")})
    VALUES ${placeholders.join(", ")}
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      date = EXCLUDED.date,
      time = EXCLUDED.time,
      image = EXCLUDED.image,
      location_id = EXCLUDED.location_id
  `;
  await pool.query(sql, values);
  console.log("✅ events seeded");
};

const reset = async () => {
  try {
    await initSchema();

    // Seed within a transaction so partial failures roll back cleanly.
    await pool.query("BEGIN");
    await seedLocations();
    await seedEvents();
    await pool.query("COMMIT");

    console.log("🎉 reset complete");
  } catch (err) {
    await pool.query("ROLLBACK").catch(() => {});
    console.error("Reset failed:", err);
    process.exitCode = 1;
  } finally {
    // Optional: close pool so the script exits promptly.
    await pool.end();
  }
};

reset();
export default reset;
