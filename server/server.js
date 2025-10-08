import express from "express";
import cors from "cors";
import eventsRouter from "./routes/events.js";
import locationsRouter from "./routes/locations.js";

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/events", eventsRouter);
app.use("/api/locations", locationsRouter);

// listens for app on port 3000 for connections
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`CONNECTED. Listening on port ${PORT}`);
});

export default app;
