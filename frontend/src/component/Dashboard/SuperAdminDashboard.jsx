import React, { useEffect, useState } from 'react';
import API from '../../services/axiosConfig';
import ConstantApi from '../../services/endpoints';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { department } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const res = await API.get(ConstantApi.admin.getAllAdmins);
        if (res.data.success) {
          setAdmins(res.data.admins);
        } else {
          toast.error(res.data.message || 'Failed to load admins');
        }
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || 'Error fetching admins');
      } finally {
        setLoading(false);
      }
    };
    if (department?.role === 'superadmin') {
      fetchAdmins();
    }
  }, [department]);

  return (
    <div className="min-h-screen bg-[#F5F5DC] p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#1A237E]">Super Admin Dashboard</h1>
        <button
          onClick={() => navigate('/superadmin/subscriptions')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A237E] text-white text-sm font-semibold hover:bg-[#283593] transition"
        >
          <CreditCard className="w-4 h-4" /> Manage Subscriptions
        </button>
      </div>
      {loading ? (
        <p className="text-gray-600">Loading admins...</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-[#1A237E] text-white">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id} className="border-b">
                <td className="py-2 px-4">{admin.department || admin.name}</td>
                <td className="py-2 px-4">{admin.email}</td>
                <td className="py-2 px-4 capitalize">{admin.status || 'active'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
