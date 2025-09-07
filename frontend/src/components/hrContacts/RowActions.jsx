// src/components/hrContacts/RowActions.jsx
import React from "react";

const RowActions = ({ onView }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onView}
        className="px-3 py-1 text-xs rounded bg-[#13665b] text-white hover:bg-[#0fa18e]"
      >
        View
      </button>
      <button className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
        Quick Log
      </button>
    </div>
  );
};

export default RowActions;
