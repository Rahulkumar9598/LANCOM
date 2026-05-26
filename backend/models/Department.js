import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  headName: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '🏢'  // Default icon
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  role: {
    type: String,
    enum: ['admin', 'department'],
    default: 'department'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  serviceExpiresAt: {
    type: Date,
    default: null
  },
  serviceDurationMonths: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});


export default mongoose.model('Department', departmentSchema);