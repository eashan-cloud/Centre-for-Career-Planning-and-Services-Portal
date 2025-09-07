// src/components/hrContacts/HRContactsTable.jsx
import React from "react";
import StatusPill from "./StatusPill";
import RowActions from "./RowActions";

const HRContactsTable = ({ contacts, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Company</th>
            <th className="p-3">Designation</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Assigned To</th>
            <th className="p-3">Status</th>
            {/* <th className="p-3">Last Contacted</th> */}
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id} className="border-t hover:bg-gray-50">
              <td className="p-3 font-semibold">{c.full_name}</td>
              <td className="p-3">{c.company}</td>
              <td className="p-3">{c.designation}</td>
              <td className="p-3 text-sm">
                {c.phone}
                <br />
                {c.email}
              </td>
              <td className="p-3">{c.assigned_to_user_name || "Unassigned"}</td>
              <td className="p-3">
                <StatusPill status={c.status} />
              </td>
              {/* <td className="p-3">{c.lastContacted}</td> */}
              <td className="p-3">
                <RowActions onView={() => onView(c)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HRContactsTable;
