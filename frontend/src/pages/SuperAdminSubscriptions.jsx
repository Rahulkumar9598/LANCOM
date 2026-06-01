import React, { useEffect, useState } from 'react';
import { Download, Edit2, Check, X, Plus, Trash2, ShieldCheck, Clock, Users, Package, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import API from '../services/axiosConfig.js';

const SuperAdminSubscriptions = () => {
  const [admins, setAdmins] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});

  // Emergency extend state
  const [emergencyOpen, setEmergencyOpen] = useState({}); // { adminId: bool }
  const [emergencyForm, setEmergencyForm] = useState({}); // { adminId: { value, unit } }
  const [extending, setExtending] = useState(null);
  const [extendResult, setExtendResult] = useState({});

  // History
  const [history, setHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await API.get('/subscription/superadmin/history');
      setHistory(res.data.history || []);
    } catch (e) { console.error(e); }
  };

  // Plan editing state
  const [editingPlan, setEditingPlan] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newPlan, setNewPlan] = useState({ name: '', months: '', price: '', description: '', features: '' });
  const [showNewPlan, setShowNewPlan] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [adminsRes, plansRes] = await Promise.all([
        API.get('/subscription/superadmin/admins'),
        API.get('/subscription/superadmin/plans'),
      ]);
      setAdmins(adminsRes.data.admins || []);
      setPlans(plansRes.data.plans || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); fetchHistory(); }, []);

  const handleEmergencyExtend = async (admin) => {
    const form = emergencyForm[admin._id] || { value: '', unit: 'minutes' };
    if (!form.value || isNaN(form.value) || Number(form.value) <= 0) {
      setExtendResult(r => ({ ...r, [admin._id]: { success: false, message: 'Enter a valid number' } }));
      return;
    }
    setExtending(admin._id);
    setExtendResult(r => ({ ...r, [admin._id]: null }));
    try {
      const res = await API.post('/subscription/superadmin/emergency-extend', {
        adminId: admin._id,
        value: Number(form.value),
        unit: form.unit,
      });
      // Auto-download the generated .lca file
      if (res.data.fileContent) {
        const blob = new Blob([res.data.fileContent], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = res.data.fileName || `${admin.department}_emergency.lca`;
        a.click();
        URL.revokeObjectURL(url);
      }
      setExtendResult(r => ({ ...r, [admin._id]: { success: true, message: res.data.message } }));
      fetchAll();
      fetchHistory();
      setTimeout(() => {
        setEmergencyOpen(o => ({ ...o, [admin._id]: false }));
        setExtendResult(r => ({ ...r, [admin._id]: null }));
      }, 3000);
    } catch (e) {
      setExtendResult(r => ({ ...r, [admin._id]: { success: false, message: e.response?.data?.message || 'Failed' } }));
    } finally {
      setExtending(null);
    }
  };

  const generateFile = async (admin) => {
    const planId = selectedPlan[admin._id];
    if (!planId) return alert('Select a plan first');
    setGenerating(admin._id);
    try {
      const res = await API.post('/subscription/superadmin/generate',
        { adminId: admin._id, planId },
        { responseType: 'blob' }
      );
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${admin.department}_activation.lca`;
      a.click();
      URL.revokeObjectURL(url);
      // Refresh activation history to reflect the new subscription immediately
      fetchHistory();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to generate file');
    } finally {
      setGenerating(null);
    }
  };

  const savePlan = async () => {
    try {
      await API.put(`/subscription/superadmin/plans/${editingPlan}`, {
        ...editForm,
        features: typeof editForm.features === 'string'
          ? editForm.features.split('\n').filter(Boolean)
          : editForm.features,
      });
      setEditingPlan(null);
      fetchAll();
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
  };

  const createPlan = async () => {
    try {
      await API.post('/subscription/superadmin/plans', {
        ...newPlan,
        months: Number(newPlan.months),
        price: Number(newPlan.price),
        features: newPlan.features.split('\n').filter(Boolean),
      });
      setShowNewPlan(false);
      setNewPlan({ name: '', months: '', price: '', description: '', features: '' });
      fetchAll();
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
  };

  const deletePlan = async (id) => {
    if (!confirm('Delete this plan?')) return;
    try {
      await API.delete(`/subscription/superadmin/plans/${id}`);
      fetchAll();
    } catch (e) { alert('Failed'); }
  };

  const statusBadge = (admin) => {
    if (!admin.serviceExpiresAt) return <span className="text-xs text-gray-400">No subscription</span>;
    if (!admin.isActive) return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold">Expired</span>;
    if (admin.daysLeft <= 30) return <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">{admin.daysLeft}d left</span>;
    return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">{admin.daysLeft}d left</span>;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A237E]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      {/* Navbar */}
      <nav className="bg-[#1A237E] border-b-2 border-[#FF9933] px-6 py-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center">
          <span className="text-[#1A237E] font-bold text-sm">◎</span>
        </div>
        <h1 className="text-white font-bold text-sm tracking-wide">LANCOM — Subscription Manager</h1>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ── Plans Section ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#1A237E]">
            <h2 className="text-white font-bold text-sm flex items-center gap-2"><Package className="w-4 h-4 text-[#FF9933]" /> Subscription Plans</h2>
            <button onClick={() => setShowNewPlan(v => !v)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#FF9933] text-[#1A237E] text-xs font-bold">
              <Plus className="w-3 h-3" /> New Plan
            </button>
          </div>

          {/* New plan form */}
          {showNewPlan && (
            <div className="px-4 py-3 bg-indigo-50 border-b border-gray-200 grid grid-cols-2 md:grid-cols-5 gap-2">
              <input className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs" placeholder="Name" value={newPlan.name} onChange={e => setNewPlan(p => ({ ...p, name: e.target.value }))} />
              <input className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs" placeholder="Months" type="number" value={newPlan.months} onChange={e => setNewPlan(p => ({ ...p, months: e.target.value }))} />
              <input className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs" placeholder="Price (₹)" type="number" value={newPlan.price} onChange={e => setNewPlan(p => ({ ...p, price: e.target.value }))} />
              <textarea className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs" placeholder={"Features (one per line)"} rows={2} value={newPlan.features} onChange={e => setNewPlan(p => ({ ...p, features: e.target.value }))} />
              <div className="flex gap-1 items-start">
                <button onClick={createPlan} className="px-3 py-1.5 rounded-lg bg-[#1A237E] text-white text-xs font-semibold flex items-center gap-1"><Check className="w-3 h-3" /> Save</button>
                <button onClick={() => setShowNewPlan(false)} className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-xs"><X className="w-3 h-3" /></button>
              </div>
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {plans.map(plan => (
              <div key={plan._id} className="px-4 py-3 flex items-center gap-4">
                {editingPlan === plan._id ? (
                  <>
                    <input className="border rounded px-2 py-1 text-xs w-24" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                    <input className="border rounded px-2 py-1 text-xs w-16" type="number" value={editForm.months} onChange={e => setEditForm(f => ({ ...f, months: e.target.value }))} />
                    <input className="border rounded px-2 py-1 text-xs w-20" type="number" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} placeholder="₹ Price" />
                    <div className="flex gap-1 ml-auto">
                      <button onClick={savePlan} className="p-1.5 rounded bg-green-100 text-green-700"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditingPlan(null)} className="p-1.5 rounded bg-gray-100 text-gray-500"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#1A237E]" />
                      <span className="text-sm font-semibold text-gray-800">{plan.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{plan.months} months</span>
                    <span className="text-xs font-bold text-[#1A237E]">₹{plan.price.toLocaleString()}</span>
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex gap-1 ml-auto">
                      <button onClick={() => { setEditingPlan(plan._id); setEditForm({ name: plan.name, months: plan.months, price: plan.price, isActive: plan.isActive }); }}
                        className="p-1.5 rounded hover:bg-gray-100"><Edit2 className="w-3.5 h-3.5 text-gray-500" /></button>
                      <button onClick={() => deletePlan(plan._id)} className="p-1.5 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Admins Section ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-[#1A237E]">
            <h2 className="text-white font-bold text-sm flex items-center gap-2"><Users className="w-4 h-4 text-[#FF9933]" /> Admin Subscriptions</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {admins.length === 0 && (
              <div className="text-center py-8 text-xs text-gray-400">No admins found</div>
            )}
            {admins.map(admin => (
              <div key={admin._id} className="border-b border-gray-100 last:border-0">
                {/* Main row */}
                <div className="px-4 py-3 flex flex-wrap items-center gap-3">
                  {/* Info */}
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <div className="w-7 h-7 rounded-full bg-[#1A237E] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {admin.department?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{admin.department}</p>
                      <p className="text-[10px] text-gray-400">{admin.email}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {statusBadge(admin)}
                    {admin.serviceExpiresAt && (
                      <span className="text-[10px] text-gray-400">
                        Expires {new Date(admin.serviceExpiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-auto flex-wrap">
                    {/* Emergency extend toggle */}
                    <button
                      onClick={() => setEmergencyOpen(o => ({ ...o, [admin._id]: !o[admin._id] }))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border
                        ${emergencyOpen[admin._id]
                          ? 'bg-orange-100 text-orange-700 border-orange-300'
                          : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'}`}
                    >
                      <Zap className="w-3 h-3" />
                      Emergency
                      {emergencyOpen[admin._id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {/* Generate .lca */}
                    <select
                      value={selectedPlan[admin._id] || ''}
                      onChange={e => setSelectedPlan(p => ({ ...p, [admin._id]: e.target.value }))}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-gray-50"
                    >
                      <option value="">Select plan</option>
                      {plans.filter(p => p.isActive).map(p => (
                        <option key={p._id} value={p._id}>{p.name} — {p.months}mo</option>
                      ))}
                    </select>
                    <button
                      onClick={() => generateFile(admin)}
                      disabled={generating === admin._id || !selectedPlan[admin._id]}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition
                        ${generating === admin._id || !selectedPlan[admin._id]
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#1A237E] text-white hover:bg-[#283593]'}`}
                    >
                      {generating === admin._id
                        ? <div className="w-3 h-3 rounded-full border-b border-white animate-spin" />
                        : <Download className="w-3 h-3" />}
                      {generating === admin._id ? 'Generating...' : 'Generate .lca'}
                    </button>
                  </div>
                </div>

                {/* Emergency extend panel */}
                {emergencyOpen[admin._id] && (
                  <div className="mx-4 mb-3 p-3 bg-orange-50 border border-orange-200 rounded-xl space-y-2">
                    <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Emergency Extension — extends from current expiry
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="number"
                        min="1"
                        placeholder="Amount"
                        value={emergencyForm[admin._id]?.value || ''}
                        onChange={e => setEmergencyForm(f => ({ ...f, [admin._id]: { ...f[admin._id], value: e.target.value } }))}
                        className="border border-orange-200 rounded-lg px-3 py-1.5 text-xs w-24 bg-white focus:outline-none focus:border-orange-400"
                      />
                      <select
                        value={emergencyForm[admin._id]?.unit || 'minutes'}
                        onChange={e => setEmergencyForm(f => ({ ...f, [admin._id]: { ...f[admin._id], unit: e.target.value } }))}
                        className="border border-orange-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none"
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>

                      {/* Quick presets */}
                      {[
                        { label: '30 min', value: 30, unit: 'minutes' },
                        { label: '1 hr', value: 1, unit: 'hours' },
                        { label: '1 day', value: 1, unit: 'days' },
                        { label: '7 days', value: 7, unit: 'days' },
                      ].map(p => (
                        <button key={p.label}
                          onClick={() => setEmergencyForm(f => ({ ...f, [admin._id]: { value: p.value, unit: p.unit } }))}
                          className="px-2 py-1 text-[10px] bg-white border border-orange-200 rounded-lg text-orange-600 hover:bg-orange-100 transition">
                          {p.label}
                        </button>
                      ))}

                      <button
                        onClick={() => handleEmergencyExtend(admin)}
                        disabled={extending === admin._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition disabled:opacity-50 ml-auto"
                      >
                        {extending === admin._id
                          ? <div className="w-3 h-3 rounded-full border-b border-white animate-spin" />
                          : <Zap className="w-3 h-3" />}
                        {extending === admin._id ? 'Extending...' : 'Extend Now'}
                      </button>
                    </div>

                    {extendResult[admin._id] && (
                      <p className={`text-[10px] font-medium px-2 py-1.5 rounded-lg
                        ${extendResult[admin._id].success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {extendResult[admin._id].message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── History ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#1A237E]">
            <h2 className="text-white font-bold text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF9933]" /> Activation History
            </h2>
            <input
              type="text"
              placeholder="Filter by department..."
              value={historyFilter}
              onChange={e => setHistoryFilter(e.target.value)}
              className="bg-white/10 text-white placeholder-white/50 text-xs px-2 py-1 rounded-lg border border-white/20 outline-none w-40"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Department', 'Type', 'Plan / Duration', 'Issued At', 'Expires At', 'Status'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history
                  .filter(h => !historyFilter || h.adminDepartment?.toLowerCase().includes(historyFilter.toLowerCase()))
                  .map(h => (
                  <tr key={h._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <p className="font-semibold text-gray-800">{h.adminDepartment}</p>
                      <p className="text-[10px] text-gray-400">{h.adminEmail}</p>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${h.type === 'emergency' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {h.type === 'emergency' ? '⚡ Emergency' : '📦 Plan'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {h.type === 'emergency' ? h.emergencyDuration : `${h.planName} (${h.months}mo)`}
                    </td>
                    <td className="px-4 py-2 text-gray-500">{new Date(h.issuedAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-gray-500">{new Date(h.expiresAt).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold
                        ${h.status === 'used' ? 'bg-green-100 text-green-700' : h.status === 'expired' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-600'}`}>
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-6 text-gray-400">No history yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminSubscriptions;
