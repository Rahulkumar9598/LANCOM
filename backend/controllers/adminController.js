import bcrypt from 'bcryptjs';
import Department from '../models/Department.js';

export const registerDepartment = async (req, res) => {
  // existing code unchanged (omitted for brevity)
};

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .select('-password')
      .sort({ department: 1 });
    res.json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

  // New function: admin can set service duration for all departments
export const setGlobalServiceAccess = async (req, res) => {
  try {
    const { durationMonths } = req.body; // allowed values: 1,2,3,12,24,36
    const allowed = [1, 2, 3, 12, 24, 36];
    if (!allowed.includes(Number(durationMonths))) {
      return res.status(400).json({ success: false, message: 'Invalid duration' });
    }
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + Number(durationMonths));
    const result = await Department.updateMany(
      { role: 'department' },
      { serviceExpiresAt: expiresAt, serviceDurationMonths: Number(durationMonths) }
    );
    res.json({ success: true, message: 'Service period set for all departments', updatedCount: result.nModified || result.modifiedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const setServiceAccess = async (req, res) => {
  try {
    const { id } = req.params; // department id
    const { durationMonths, expiresAt } = req.body; // allowed values or exact date
    const allowed = [1, 2, 3, 12, 24, 36];
    let update = {};
    if (expiresAt) {
      const date = new Date(expiresAt);
      if (isNaN(date)) {
        return res.status(400).json({ success: false, message: 'Invalid expiresAt date' });
      }
      update.serviceExpiresAt = date;
    } else {
      if (!allowed.includes(Number(durationMonths))) {
        return res.status(400).json({ success: false, message: 'Invalid duration' });
      }
      const now = new Date();
      const expires = new Date();
      expires.setMonth(expires.getMonth() + Number(durationMonths));
      update.serviceExpiresAt = expires;
    }
    // always set durationMonths if provided
    if (durationMonths) {
      update.serviceDurationMonths = Number(durationMonths);
    }
    const updated = await Department.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true, select: '-password' }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, message: 'Service period updated', department: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
