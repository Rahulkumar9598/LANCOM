import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; // assuming you have an API helper


const AdminProfile = () => {
  const [departments, setDepartments] = useState([]);
  const [filter, setFilter] = useState('All'); // All | Active | Expired
  const [dateFilter, setDateFilter] = useState(''); // YYYY-MM-DD
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await API.get('/admin/departments'); // endpoint should return list with serviceExpiresAt
        if (res.data.success) {
          setDepartments(res.data.departments);
        }
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    };
    fetchDepartments();
  }, []);

  // Helper to update expiration date for a department
  const [editingDept, setEditingDept] = useState(null);
  const [newDate, setNewDate] = useState('');

  // Update expiration via API with selected date
  const saveExpiration = async (deptId) => {
    if (!newDate) {
      alert('Please select a date');
      return;
    }
    // Use the selected date directly as expiresAt
    const expiresAt = new Date(newDate);
    if (isNaN(expiresAt)) {
      alert('Invalid date format');
      return;
    }
    // Calculate durationMonths for compatibility, but also send explicit expiresAt
    const now = new Date();
    const diffMonths = Math.max(1, Math.round((expiresAt.getFullYear() - now.getFullYear()) * 12 + (expiresAt.getMonth() - now.getMonth())));
    const allowed = [1, 2, 3, 12, 24, 36];
    const duration = allowed.includes(diffMonths) ? diffMonths : 1;
    try {
      await API.put(`/admin/departments/${deptId}/service`, { durationMonths: duration, expiresAt: expiresAt.toISOString() });
      const res = await API.get('/admin/departments');
      if (res.data.success) setDepartments(res.data.departments);
    } catch (err) {
      console.error('Failed to update expiration', err);
      alert('Update failed');
    }
    setEditingDept(null);
    setNewDate('');
  };

  const cancelEdit = () => {
    setEditingDept(null);
    setNewDate('');
  };

  // Helper to start editing a department
  const startEdit = (deptId) => {
    setEditingDept(deptId);
    setNewDate('');
  };
  // Filtered departments based on selected filter and optional date
  const filteredDepartments = departments.filter((dept) => {
    // Status filter
    if (filter !== 'All') {
      if (!dept.serviceExpiresAt) return filter === 'Active';
      const expired = new Date(dept.serviceExpiresAt) < new Date();
      if (filter === 'Active' && expired) return false;
      if (filter === 'Expired' && !expired) return false;
    }
    // Date filter (YYYY-MM-DD)
    if (dateFilter) {
      if (!dept.serviceExpiresAt) return false;
      const deptDate = new Date(dept.serviceExpiresAt).toISOString().slice(0, 10);
      return deptDate === dateFilter;
    }
    return true;
  });
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6 overflow-auto relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-2 shadow-lg z-10"
        aria-label="Back"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
        {/* Filter dropdown */}
        <div className="flex items-center mb-4">
          <label className="mr-2 text-sm font-medium text-gray-700">Service Expiration:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded p-1 text-sm"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="border border-gray-300 rounded p-1 text-sm ml-2" placeholder="Select date" />
        </div>
        <h1 className="text-2xl font-bold text-[#1A237E] mb-4">Admin Profile</h1>
        {filteredDepartments.length === 0 ? (
          <p className="text-gray-500">No departments registered.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-[#1A237E] text-white">
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Service Expiration</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>


                {filteredDepartments.map((dept) => (
                  <tr key={dept._id} className="border-b">
                    <td className="px-4 py-2">{dept.department}</td>
                    <td className="px-4 py-2">{dept.role}</td>
                    <td className="px-4 py-2">
                      {dept.serviceExpiresAt ? (
                        <>
                          {formatDate(dept.serviceExpiresAt)}<br />
                          <span className="text-xs text-gray-500">{new Date(dept.serviceExpiresAt).toISOString().slice(0, 10)}</span>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {/* Edit expiration UI */}
                      {editingDept === dept._id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="border border-gray-300 rounded p-1 text-sm"
                          />
                          <button
                            onClick={() => saveExpiration(dept._id)}
                            className="text-sm text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(dept._id)}
                          className="text-sm text-[#1A237E] hover:underline"
                        >
                          Edit Expiration
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
