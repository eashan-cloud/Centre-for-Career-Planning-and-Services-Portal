import express from 'express';
import {
  createHRContact,
  getAllHRContacts,
  getHRContactById,
  updateHRContact,
  deleteHRContact,
  assignCallerToHR,
  exportHRContactsCSV
} from '../controllers/hrContact.controller.js';

import { protectRoute, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();


// All users (admin + caller) can read
router.get('/', protectRoute, getAllHRContacts);
router.get('/:id', protectRoute, getHRContactById);


// Only admin or caller can create HR contact
router.post('/', protectRoute, authorizeRoles('admin', 'caller'), createHRContact);

// Only admin can update (including assigning HR)
router.put('/:id', protectRoute, authorizeRoles('admin'), updateHRContact);

router.patch('/:id/assign', protectRoute, authorizeRoles('admin'), assignCallerToHR);

// Only admin can delete
router.delete('/:id', protectRoute, authorizeRoles('admin'), deleteHRContact);


// Only admin can export CSV
router.get('/export/csv', protectRoute, authorizeRoles('admin'), exportHRContactsCSV);

export default router;
