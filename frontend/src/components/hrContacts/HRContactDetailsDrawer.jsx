// src/components/hrContacts/HRContactDetailsDrawer.jsx
import React from "react";
import PropTypes from "prop-types";

const HRContactDetailsDrawer = ({ open, onClose, contact }) => {
  if (!open || !contact) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">
      <div className="w-full max-w-md bg-white shadow-lg p-6 space-y-4 overflow-y-auto">
        <header className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{contact.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </header>
        <p><strong>Company:</strong> {contact.company}</p>
        <p><strong>Designation:</strong> {contact.designation}</p>
        <p><strong>Phone:</strong> {contact.phone}</p>
        <p><strong>Email:</strong> {contact.email}</p>
        <p><strong>Assigned To:</strong> {contact.assignedTo || "Unassigned"}</p>
        <p><strong>Status:</strong> {contact.status}</p>
        <p><strong>Last Contacted:</strong> {contact.lastContacted}</p>
      </div>
    </div>
  );
};




HRContactDetailsDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  contact: PropTypes.shape({
    name: PropTypes.string.isRequired,
    company: PropTypes.string,
    designation: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    assignedTo: PropTypes.string,
    status: PropTypes.string,
    lastContacted: PropTypes.string,
  }),
};




export default HRContactDetailsDrawer;
