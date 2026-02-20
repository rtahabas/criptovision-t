"use client";

import React from "react";

function getTimezoneString() {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const offsetMinutes = -new Date().getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";

  const hours = Math.floor(Math.abs(offsetMinutes) / 60)
    .toString()
    .padStart(2, "0");

  const minutes = (Math.abs(offsetMinutes) % 60)
    .toString()
    .padStart(2, "0");

  return `${zone} (UTC${sign}${hours}:${minutes})`;
}

export function useTimezone() {
  const [timezone, setTimezone] = React.useState(null);

  React.useEffect(() => {
    setTimezone(getTimezoneString());
  }, []);

  return timezone;
}