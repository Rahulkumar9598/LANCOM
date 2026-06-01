import React, { useState } from 'react';
import API from '../services/api';

// Reusable form component for adding an employee
const EmployeeForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', role: 'employee', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await API.post('/department/employee', formData);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Employee added successfully' });
        setFormData({ name: '', email: '', role: 'employee', password: '' });
      } else {
        setMessage({ type: 'error', text: res.data.message || 'Failed to add employee' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Server error' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20">
      <h2 className="text-2xl font-semibold mb-4 text-white">Add Employee</h2>
      {message && (
        <div className={`mb-4 p-2 rounded ${message.type === 'success' ? 'bg-green-700' : 'bg-red-700'} text-white`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          name="password"
          type="password"
          placeholder="Temporary Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          {loading ? 'Adding...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
