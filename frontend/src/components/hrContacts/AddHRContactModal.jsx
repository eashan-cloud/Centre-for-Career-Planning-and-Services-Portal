// src/components/hrContacts/AddHRContactModal.jsx
import React, { useState } from "react";

const AddHRContactModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    full_name: "",
    designation: "",
    email: "",
    phone_1: "",
    phone_2: "",
    linkedin_profile: "",
    source: "",
    status: "active",
    notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave(form); // pass form to parent -> API call
    setForm({
      full_name: "",
      designation: "",
      email: "",
      phone_1: "",
      phone_2: "",
      linkedin_profile: "",
      source: "",
      status: "active",
      notes: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg space-y-4">
        <h2 className="text-xl font-bold">Add HR Contact</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        
          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="phone_1"
            placeholder="Phone 1"
            value={form.phone_1}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="phone_2"
            placeholder="Phone 2"
            value={form.phone_2}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="linkedin_profile"
            placeholder="LinkedIn Profile URL"
            value={form.linkedin_profile}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
          <input
            name="source"
            placeholder="Source"
            value={form.source}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blacklisted">Blacklisted</option>
          </select>
          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-[#13665b] text-white hover:bg-[#0fa18e]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHRContactModal;
