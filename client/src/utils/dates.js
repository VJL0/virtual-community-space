// client/src/utils/dates.js

// Build a Date from separate date ("2025-10-08") and time ("14:00") strings.
// Falls back to parsing a single string if you already have an ISO-like value.
export const toDate = (dateStr, timeStr) => {
  if (dateStr && timeStr) return new Date(`${dateStr}T${timeStr}`);
  if (dateStr) return new Date(dateStr);
  return null;
};

// "14:00" -> "2:00 PM"
export const formatTime = (timeString) => {
  if (!timeString) return "";
  const d = new Date(`1970-01-01T${timeString}`);
  return isNaN(d)
    ? timeString
    : d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

// "2025-10-08T14:00" (or Date) -> "2 days remaining" / "Event passed" / "Starting soon"
export const formatRemainingTime = (targetInput) => {
  if (!targetInput) return "";

  const target =
    targetInput instanceof Date ? targetInput : new Date(targetInput);

  if (isNaN(target)) return "";

  const now = new Date();
  const diffMs = target - now;

  if (diffMs < 0) return "Event passed";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} remaining`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} remaining`;
  if (minutes > 0)
    return `${minutes} minute${minutes > 1 ? "s" : ""} remaining`;
  return "Starting soon";
};

// Apply visual style when an event has passed (DOM-based, matches your current usage)
export const formatNegativeTimeRemaining = (remainingText, eventId) => {
  try {
    const el = document.getElementById(`remaining-${eventId}`);
    if (!el || !remainingText) return;

    if (remainingText.toLowerCase().includes("passed")) {
      el.style.color = "#b0b0b0";
      el.style.textDecoration = "line-through";
    } else {
      el.style.color = "var(--accent-color, #00cc66)";
      el.style.textDecoration = "none";
    }
  } catch (err) {
    console.error("Error styling remaining time:", err);
  }
};
