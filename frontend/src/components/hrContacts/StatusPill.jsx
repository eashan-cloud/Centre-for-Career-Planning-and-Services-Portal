// src/components/hrContacts/StatusPill.jsx
import React from "react";

const StatusPill = ({ status }) => {
  const colors =
    status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-200 text-gray-600";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors}`}>
      {status}
    </span>
  );
};

export default StatusPill;
