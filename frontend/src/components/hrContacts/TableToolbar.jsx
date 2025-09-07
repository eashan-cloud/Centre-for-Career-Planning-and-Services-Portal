// src/components/hrContacts/TableToolbar.jsx
import React from "react";

const TableToolbar = ({ total }) => {
  return (
    <div className="flex justify-between items-center text-sm text-gray-600">
      <p>{total} results found</p>
      <button className="underline text-[#13665b] hover:text-[#0fa18e]">
        Export CSV
      </button>
    </div>
  );
};

export default TableToolbar;
