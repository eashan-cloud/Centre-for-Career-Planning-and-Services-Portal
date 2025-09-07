// src/pages/HRContactsPage.jsx
import React, { useState , useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import HRContactsHeader from "../../components/hrContacts/HRContactsHeader";
import FilterBar from "../../components/hrContacts/FilterBar";
import TableToolbar from "../../components/hrContacts/TableToolbar";
import HRContactsTable from "../../components/hrContacts/HRContactsTable";
import HRContactDetailsDrawer from "../../components/hrContacts/HRContactDetailsDrawer";
import AddHRContactModal from "../../components/hrContacts/AddHRContactModal";


import {
  getAllHRContacts,
  createHRContact
} from "../../api/hr-contacts/hrContacts";


const HRContactsPage = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);





    const fetchContacts = async () => {
  try {
    setLoading(true);
    const response = await getAllHRContacts();
    console.log("API response:", response);

    // response.data is the array of contacts
    setContacts(response.data); 
  } catch (err) {
    setError("Failed to load HR contacts");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchContacts();
  }, []);


  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setIsDetailsOpen(true);
  };

  const handleAddContact = async (newContact) => {
    try {
      await createHRContact(newContact);
      fetchContacts(); // refresh list after add
    } catch (err) {
      console.error("Error adding contact", err);
    }
    console.log("New HR Contact to send to backend:", newContact);
    setIsAddOpen(false);
  };




//   const [searchTerm, setSearchTerm] = React.useState("");
// const [statusFilter, setStatusFilter] = React.useState("");
// const [assignmentFilter, setAssignmentFilter] = React.useState("");

// const filteredContacts = contacts.filter(contact => {
//   const matchesSearch =
//     contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     contact.company.toLowerCase().includes(searchTerm.toLowerCase());

//   const matchesStatus = statusFilter ? contact.status === statusFilter : true;

//   const matchesAssignment = assignmentFilter
//     ? assignmentFilter === "me"
//       ? contact.assignedTo === "me"
//       : assignmentFilter === "others"
//       ? contact.assignedTo !== "me" && contact.assignedTo
//       : contact.assignedTo === null
//     : true;

//   return matchesSearch && matchesStatus && matchesAssignment;
// });





  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 pt-16 md:pt-8 w-full max-w-7xl mx-auto space-y-6">
        <HRContactsHeader total={contacts.length} onAdd={() => setIsAddOpen(true)} />
        {/* <FilterBar
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  statusFilter={statusFilter}
  setStatusFilter={setStatusFilter}
  assignmentFilter={assignmentFilter}
  setAssignmentFilter={setAssignmentFilter}
/> */}

<FilterBar/>

{/* <HRContactsTable contacts={filteredContacts} onView={handleViewContact} /> */}

        <TableToolbar total={contacts.length} />
        <HRContactsTable contacts={contacts} onView={handleViewContact} />

        <HRContactDetailsDrawer
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          contact={selectedContact}
        />

        <AddHRContactModal
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSave={handleAddContact}
        />
      </main>
    </div>
  );
};

export default HRContactsPage;
