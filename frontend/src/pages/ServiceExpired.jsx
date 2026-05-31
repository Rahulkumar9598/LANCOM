import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, Clock, ShieldAlert, Package, Phone, Mail, User, MessageCircle } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ServiceExpired = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [contact, setContact] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/api/subscription/plans`).then(r => setPlans(r.data.plans || [])).catch(() => {});
    axios.get(`${API}/api/subscription/contact`).then(r => setContact(r.data.contact)).catch(() => {});
  }, []);

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith('.lca')) {
      setResult({ success: false, message: 'Please upload a valid .lca activation file.' });
      return;
    }
    setUploading(true);
    setResult(null);
    try {
      const text = await file.text();
      const res = await axios.post(`${API}/api/subscription/activate`, { fileContent: text }, { headers: authHeader() });
      setResult({ success: true, message: res.data.message });
      // Update localStorage so PrivateRoute sees the new expiry
      try {
        const dept = JSON.parse(localStorage.getItem('department') || '{}');
        dept.serviceExpiresAt = res.data.expiresAt;
        localStorage.setItem('department', JSON.stringify(dept));
      } catch (_) {}
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (e) {
      setResult({ success: false, message: e.response?.data?.message || 'Activation failed.' });
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const planColors = ['from-blue-500 to-blue-700', 'from-indigo-500 to-indigo-700', 'from-purple-500 to-purple-700'];

  return (
    <div className="min-h-screen bg-[#F5F5DC] flex flex-col">

      {/* Header */}
      <div className="bg-[#1A237E] border-b-2 border-[#FF9933] px-6 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center">
          <span className="text-[#1A237E] font-bold text-sm">◎</span>
        </div>
        <h1 className="text-white font-bold text-sm tracking-wide">HONTO'S LANCOM</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-8">

        {/* Expired notice */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A237E]">Subscription Expired</h2>
          <p className="text-gray-500 text-sm max-w-sm">
            Your service has expired. Contact your administrator to get an activation file, then upload it below to restore access.
          </p>
        </div>

        {/* Upload area */}
        <div className="w-full max-w-md">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
              ${dragging ? 'border-[#1A237E] bg-indigo-50' : 'border-gray-300 hover:border-[#1A237E] hover:bg-gray-50'}`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".lca"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A237E]" />
                <p className="text-sm text-gray-500">Verifying activation file...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-gray-400" />
                <p className="text-sm font-semibold text-gray-700">Drop your <span className="text-[#1A237E]">.lca</span> file here</p>
                <p className="text-xs text-gray-400">or click to browse</p>
              </div>
            )}
          </div>

          {/* Result */}
          {result && (
            <div className={`mt-3 flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm
              ${result.success ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {result.success
                ? <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
              {result.message}
            </div>
          )}
        </div>

        {/* Contact Support */}
        {contact && (
          <div className="w-full max-w-3xl bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1A237E]">
              <MessageCircle className="w-4 h-4 text-[#FF9933]" />
              <h3 className="text-white font-bold text-sm">Contact Support</h3>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-500 mb-4">
                To purchase a subscription, reach out to your administrator through any of the channels below. After payment, they will generate and send you an activation file.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {contact.name && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="w-9 h-9 rounded-full bg-[#1A237E] flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Administrator</p>
                      <p className="text-sm font-bold text-gray-800">{contact.name || '—'}</p>
                    </div>
                  </div>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`}
                    className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Email</p>
                      <p className="text-sm font-semibold text-blue-700 break-all">{contact.email}</p>
                    </div>
                  </a>
                )}
                {contact.phone && (
                  <a href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition">
                    <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">WhatsApp / Call</p>
                      <p className="text-sm font-semibold text-green-700">{contact.phone}</p>
                    </div>
                  </a>
                )}
                {!contact.phone && !contact.email && (
                  <p className="col-span-3 text-xs text-gray-400 text-center py-2">Contact details not configured. Ask your superadmin to update their profile.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Plans */}
        {plans.length > 0 && (
          <div className="w-full max-w-3xl">
            <p className="text-center text-xs text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
              <Package className="w-3.5 h-3.5" /> Available Plans
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plans.map((plan, i) => (
                <div key={plan._id} className={`bg-gradient-to-br ${planColors[i % 3]} rounded-xl p-5 text-white shadow-md`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 opacity-80" />
                    <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">{plan.months} Months</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-2xl font-bold mb-3">₹{plan.price.toLocaleString()}</p>
                  <ul className="space-y-1">
                    {plan.features?.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-1.5 text-xs opacity-90">
                        <CheckCircle className="w-3 h-3 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[10px] opacity-60 italic">Contact admin to purchase</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceExpired;
