import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, ShieldAlert, ShieldOff, Upload, CheckCircle,
  AlertCircle, Clock, ArrowLeft, FileText, Info, Package,
} from 'lucide-react';
import API from '../services/axiosConfig.js';

const AdminSubscription = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [history, setHistory] = useState([]);
  const fileRef = useRef(null);
  const countdownRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const [subRes, planRes] = await Promise.all([
        API.get('/subscription/status'),
        API.get('/subscription/plans'),
      ]);
      setSubscription(subRes.data);
      setPlans(planRes.data.plans || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    API.get('/subscription/history').then(r => setHistory(r.data.history || [])).catch(() => {});
  }, []);

  // Live countdown ticker
  useEffect(() => {
    if (!subscription?.expiresAt || subscription?.noExpiry) {
      setCountdown(null);
      return;
    }
    const tick = () => {
      const diff = new Date(subscription.expiresAt) - Date.now();
      if (diff <= 0) {
        setCountdown({ h: 0, m: 0, s: 0, total: 0 });
        fetchStatus(); // refresh status when expired
        return;
      }
      const total = Math.floor(diff / 1000);
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      setCountdown({ h, m, s, total });
    };
    tick();
    countdownRef.current = setInterval(tick, 1000);
    return () => clearInterval(countdownRef.current);
  }, [subscription?.expiresAt]);

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith('.lca')) {
      setResult({ success: false, message: 'Please upload a valid .lca activation file.' });
      return;
    }
    setActivating(true);
    setResult(null);
    try {
      const text = await file.text();
      const res = await API.post('/subscription/activate', { fileContent: text });
      setResult({ success: true, message: res.data.message });
      // Update localStorage so PrivateRoute sees the new expiry
      try {
        const dept = JSON.parse(localStorage.getItem('department') || '{}');
        dept.serviceExpiresAt = res.data.expiresAt;
        localStorage.setItem('department', JSON.stringify(dept));
      } catch (_) {}
      setShowExtend(false);
      fetchStatus();
    } catch (e) {
      setResult({ success: false, message: e.response?.data?.message || 'Activation failed.' });
    } finally {
      setActivating(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A237E]" />
    </div>
  );

  const { isActive, noExpiry, daysLeft, expiresAt, plan } = subscription || {};
  const expiring = isActive && !noExpiry && daysLeft > 0 && daysLeft <= 30;
  const maxDays = plan ? parseInt(plan) * 30 : 365;
  const pct = (isActive && !noExpiry && daysLeft) ? Math.min(100, Math.round((daysLeft / maxDays) * 100)) : noExpiry ? 100 : 0;

  const statusConfig = !isActive
    ? { Icon: ShieldOff, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-400', label: 'Expired', ring: 'bg-red-100' }
    : expiring
    ? { Icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', bar: 'bg-orange-400', label: 'Expiring Soon', ring: 'bg-orange-100' }
    : { Icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500', label: noExpiry ? 'Active (No Expiry)' : 'Active', ring: 'bg-emerald-100' };

  const expiryFormatted = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  const planColors = ['from-blue-500 to-blue-700', 'from-indigo-500 to-indigo-700', 'from-purple-600 to-purple-800'];

  return (
    <div className="min-h-screen bg-[#F5F5DC] flex flex-col">

      {/* Navbar */}
      <nav className="bg-[#1A237E] border-b-2 border-[#FF9933] px-4 py-2 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')}
          className="text-white/70 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="w-7 h-7 rounded-full bg-[#FF9933] flex items-center justify-center">
          <span className="text-[#1A237E] font-bold text-xs">◎</span>
        </div>
        <h1 className="text-white font-bold text-sm tracking-wide">Subscription</h1>
      </nav>

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-5">

        {/* ── Status Card ── */}
        <div className={`bg-white rounded-xl border ${statusConfig.border} shadow-sm overflow-hidden`}>
          <div className="px-5 py-4 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full ${statusConfig.ring} flex items-center justify-center flex-shrink-0`}>
              <statusConfig.Icon className={`w-7 h-7 ${statusConfig.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-bold text-gray-800">Subscription Status</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div className={`${statusConfig.bar} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
              {/* Countdown timer — shown when < 24 hours left */}
              {countdown && countdown.total > 0 && countdown.total < 86400 && (
                <div className={`inline-flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold
                  ${countdown.total < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-orange-100 text-orange-600'}`}>
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {String(countdown.h).padStart(2,'0')}:
                    {String(countdown.m).padStart(2,'0')}:
                    {String(countdown.s).padStart(2,'0')}
                  </span>
                  <span className="text-xs font-normal opacity-70">remaining</span>
                </div>
              )}
              {countdown && countdown.total === 0 && (
                <div className="inline-flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-sm font-bold animate-pulse">
                  <ShieldOff className="w-4 h-4" /> Subscription just expired — upload activation file
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                {noExpiry ? (
                  <span className="text-emerald-600 font-semibold">Lifetime access — no expiry</span>
                ) : isActive ? (
                  <>
                    {(!countdown || countdown.total >= 86400) && (
                      <span className={`font-semibold ${expiring ? 'text-orange-500' : 'text-[#1A237E]'}`}>
                        {daysLeft} days remaining
                      </span>
                    )}
                    {expiryFormatted && (
                      <span>Expires: <span className="font-semibold text-gray-700">{expiryFormatted}</span></span>
                    )}
                  </>
                ) : (
                  <span className="text-red-500 font-semibold">
                    {expiryFormatted ? `Expired on ${expiryFormatted}` : 'No active subscription'}
                  </span>
                )}
                {plan && !noExpiry && (
                  <span>Plan: <span className="font-semibold text-gray-700">{plan}</span></span>
                )}
              </div>
            </div>
          </div>
          {expiring && isActive && (
            <div className="px-5 py-2.5 bg-orange-50 border-t border-orange-100 text-xs text-orange-600 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Your subscription expires soon. Contact your administrator to renew.
            </div>
          )}
          {!isActive && (
            <div className="px-5 py-2.5 bg-red-50 border-t border-red-100 text-xs text-red-600 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Your subscription has expired. Upload an activation file below to restore access.
            </div>
          )}
        </div>

        {/* ── Activate / Extend License ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#1A237E]">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#FF9933]" />
              <h3 className="text-white font-bold text-sm">
                {isActive ? 'Extend Subscription' : 'Activate Subscription'}
              </h3>
            </div>
            {/* When active, show toggle button instead of always-open upload */}
            {isActive && (
              <button
                onClick={() => { setShowExtend(v => !v); setResult(null); }}
                className={`text-xs px-3 py-1 rounded-lg font-semibold transition
                  ${showExtend ? 'bg-white/20 text-white' : 'bg-[#FF9933] text-[#1A237E]'}`}
              >
                {showExtend ? 'Cancel' : 'Upload .lca file'}
              </button>
            )}
          </div>

          {/* Show upload zone only when: expired (always) OR active and user clicked extend */}
          {(!isActive || showExtend) && (
            <div className="p-4 space-y-3">
              {isActive && showExtend && (
                <p className="text-xs text-gray-500 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                  Uploading a new activation file will extend your subscription from the current expiry date.
                </p>
              )}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
                  ${dragging ? 'border-[#1A237E] bg-indigo-50' : 'border-gray-200 hover:border-[#1A237E] hover:bg-gray-50'}`}
              >
                <input ref={fileRef} type="file" accept=".lca" className="hidden"
                  onChange={e => handleFile(e.target.files[0])} />
                {activating ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#1A237E]" />
                    <p className="text-sm text-gray-500">Verifying activation file...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <FileText className="w-8 h-8 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-700">Drop your <span className="text-[#1A237E]">.lca</span> file here</p>
                    <p className="text-xs text-gray-400">or click to browse</p>
                  </div>
                )}
              </div>

              {result && (
                <div className={`flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs font-medium
                  ${result.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                  {result.success ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                  {result.message}
                </div>
              )}
            </div>
          )}

          {/* When active and not extending, show a summary instead */}
          {isActive && !showExtend && (
            <div className="px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Subscription is active. Click "Upload .lca file" above to extend it early.
            </div>
          )}
        </div>

        {/* ── How it works ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#1A237E]">
            <Info className="w-4 h-4 text-[#FF9933]" />
            <h3 className="text-white font-bold text-sm">How to Activate</h3>
          </div>
          <div className="p-4">
            <ol className="space-y-3">
              {[
                { step: '1', title: 'Choose a plan', desc: 'Review the available plans below and decide which one fits your needs.' },
                { step: '2', title: 'Contact administrator', desc: 'Reach out to your system administrator offline (call, WhatsApp, or in person) with your chosen plan.' },
                { step: '3', title: 'Make payment', desc: 'Complete the offline payment as agreed with the administrator.' },
                { step: '4', title: 'Receive activation file', desc: 'The administrator will generate and send you a .lca activation file.' },
                { step: '5', title: 'Upload the file', desc: 'Use the upload area above to activate. Your subscription will be restored immediately.' },
              ].map(item => (
                <li key={item.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1A237E] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Plans ── */}
        {plans.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1A237E]">
              <Package className="w-4 h-4 text-[#FF9933]" />
              <h3 className="text-white font-bold text-sm">Available Plans</h3>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {plans.map((p, i) => (
                <div key={p._id} className={`bg-gradient-to-br ${planColors[i % 3]} rounded-xl p-4 text-white`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 opacity-80" />
                    <span className="text-[10px] font-semibold opacity-80 uppercase">{p.months} Months</span>
                  </div>
                  <h4 className="text-lg font-bold">{p.name}</h4>
                  <p className="text-xl font-bold mb-3">₹{p.price.toLocaleString()}</p>
                  <ul className="space-y-1">
                    {p.features?.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-1.5 text-[11px] opacity-90">
                        <CheckCircle className="w-3 h-3 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[10px] opacity-50 italic">Contact admin to purchase</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Activation History ── */}
        {history.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1A237E]">
              <Clock className="w-4 h-4 text-[#FF9933]" />
              <h3 className="text-white font-bold text-sm">Activation History</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {history.map(h => (
                <div key={h._id} className="px-4 py-2.5 flex items-center gap-3 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0
                    ${h.type === 'emergency' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {h.type === 'emergency' ? 'Emergency' : 'Plan'}
                  </span>
                  <span className="text-xs font-semibold text-gray-700">
                    {h.type === 'emergency' ? h.emergencyDuration : `${h.planName} (${h.months}mo)`}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Issued: {new Date(h.issuedAt).toLocaleDateString()}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Expires: {new Date(h.expiresAt).toLocaleDateString()}
                  </span>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold
                    ${h.status === 'used' ? 'bg-green-100 text-green-700' : h.status === 'expired' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-600'}`}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminSubscription;
