// src/components/hrContacts/HRContactsHeader.jsx
import React from "react";

const HRContactsHeader = ({ total, onAdd }) => {
  return (
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-[#13665b]">HR Contacts</h1>
        <p className="text-gray-600">Total {total} HR contacts listed.</p>
      </div>
      <button
        onClick={onAdd}
        className="px-4 py-2 rounded-lg bg-[#13665b] text-white font-semibold hover:bg-[#0fa18e] transition"
      >
        + Add HR Contact
      </button>
    </header>
  );
};

export default HRContactsHeader;
