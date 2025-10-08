import express from "express";
import EventsController from "../controllers/events.js";

const router = express.Router();

// GET / - list events. Supports optional ?locationId= for filtering
router.get("/", EventsController.getEvents);
router.get("/:eventId", EventsController.getEventById);

export default router;
