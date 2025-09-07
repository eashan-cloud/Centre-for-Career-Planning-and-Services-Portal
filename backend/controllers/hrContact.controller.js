import HRContact from '../models/hrContact.model.js';
import { exportToCSV } from '../utils/exportCSV.js'; // Utility function for CSV export
import { sendNewHRAddedEmail } from '../utils/emails.js';

// CREATE a new HR contact
export const createHRContact = async (req, res) => {
  try {
    const added_by_user_id = req.user.user_id; // Logged-in user
    const contact = { ...req.body, added_by_user_id };
    const newContact = await HRContact.createHRContact(contact);
    res.status(201).json({ success: true, data: newContact });
    await sendNewHRAddedEmail(process.env.ADMIN_EMAIL, req.user.full_name, newContact.company_name);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET all HR contacts
export const getAllHRContacts = async (req, res) => {
  try {
    const contacts = await HRContact.getAllHRContacts();
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET a single HR contact
export const getHRContactById = async (req, res) => {
  try {
    const contact = await HRContact.getHRContactById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Not Found" });
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// UPDATE an HR contact
export const updateHRContact = async (req, res) => {
  try {
    const updatedContact = await HRContact.updateHRContact(req.params.id, req.body);
    if (!updatedContact) return res.status(404).json({ success: false, message: "Not Found" });
    res.json({ success: true, data: updatedContact });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const assignCallerToHR = async (req, res) => {
  try {
    const { assigned_to_user_id } = req.body;

    if (!assigned_to_user_id) {
      return res.status(400).json({ 
        success: false, 
        message: "assigned_to_user_id is required in request body" 
      });
    }

    const updatedContact = await HRContact.assignCallerToHR(req.params.id, assigned_to_user_id);

    if (!updatedContact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.json({ success: true, data: updatedContact });
  } catch (error) {
    console.error("assignCallerToHR error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};





// DELETE an HR contact
export const deleteHRContact = async (req, res) => {
  try {
    const deletedContact = await HRContact.deleteHRContact(req.params.id);
    if (!deletedContact) return res.status(404).json({ success: false, message: "Not Found" });
    res.json({ success: true, data: deletedContact });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// EXPORT HR contacts as CSV
export const exportHRContactsCSV = async (req, res) => {
  try {
    const contacts = await HRContact.getAllHRContacts();
    const csvData = exportToCSV(contacts); // Converts array of objects to CSV string

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="hr_contacts.csv"');
    res.send(csvData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to export CSV" });
  }
};
