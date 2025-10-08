const base = "/api/events";

const getAllEvents = async (locationId) => {
  const url = locationId ? `${base}?locationId=${locationId}` : base;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

const getEventById = async (id) => {
  const res = await fetch(`${base}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
};

export default {
  getAllEvents,
  getEventById,
};
