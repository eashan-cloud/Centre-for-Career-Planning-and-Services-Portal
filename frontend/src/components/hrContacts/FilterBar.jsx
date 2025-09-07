// src/components/hrContacts/FilterBar.jsx
import React from "react";

const FilterBar = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, assignmentFilter, setAssignmentFilter }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow border">
      <input
        type="text"
        placeholder="Search by name or company..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-2 border rounded-lg w-64"
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2 border rounded-lg"
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <select
        value={assignmentFilter}
        onChange={(e) => setAssignmentFilter(e.target.value)}
        className="px-3 py-2 border rounded-lg"
      >
        <option value="">All Assignments</option>
        <option value="me">Assigned to me</option>
        <option value="others">Assigned to others</option>
        <option value="none">Unassigned</option>
      </select>
    </div>
  );
};


export default FilterBar;
