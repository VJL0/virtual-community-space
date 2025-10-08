const base = "/api/locations";

const getAllLocations = async () => {
  const res = await fetch(base);
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
};

const getLocationById = async (id) => {
  const res = await fetch(`${base}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch location");
  return res.json();
};

export default {
  getAllLocations,
  getLocationById,
};
