import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

// SVG Icons as inline components (reused from Register.jsx)
const Icons = {
  Building2: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Mail: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Lock: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V8a4 4 0 00-8 0v3h8z" />
    </svg>
  ),
  User: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  ShieldCheck: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Eye: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  EyeOff: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ),
  CheckCircle: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  AlertCircle: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ArrowLeft: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
};

const getIcon = (iconName) => {
  switch (iconName) {
    case 'Building2': return Icons.Building2;
    case 'Mail': return Icons.Mail;
    case 'Lock': return Icons.Lock;
    case 'User': return Icons.User;
    case 'ShieldCheck': return Icons.ShieldCheck;
    case 'CheckCircle': return Icons.CheckCircle;
    case 'AlertCircle': return Icons.AlertCircle;
    case 'ArrowLeft': return Icons.ArrowLeft;
    default: return null;
  }
};

const DynamicIcon = ({ name, className }) => {
  const IconComponent = getIcon(name);
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

const RegisterEmployee = () => {
  const navigate = useNavigate();
  const { department: currentDept } = useSelector((state) => state.auth);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await API.get('/department/employee');
      if (res.data.success) setEmployees(res.data.employees);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Employee name is required";

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const res = await API.post('/department/employee', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      if (res.data.success) {
        showToast(`Employee "${formData.name}" added successfully!`, 'success');
        setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'employee' });
        setFormErrors({});
        fetchEmployees(); // Refresh list
      } else {
        showToast(res.data.message || "Failed to add employee", 'error');
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Error adding employee", 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'employee' });
    setFormErrors({});
  };

  return (
    <div className="h-full relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200 shadow-lg z-50"
        aria-label="Back to Dashboard"
      >
        <DynamicIcon name="ArrowLeft" className="w-5 h-5" />
      </button>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className={`${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
            {toastType === 'success' ? '✅' : '❌'}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-start h-[90vh]">

          {/* Left Side - Branding & Department Info */}
          <div className="hidden lg:flex flex-col text-white space-y-6 pt-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl text-2xl">
                👥
              </div>
              <div>
                <h1 className="text-xl font-bold">Factory Manager</h1>
                <p className="text-blue-200 text-xs">Enterprise Management System</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight mt-6">
              Employee<br />
              <span className="text-blue-300">Management</span>
            </h2>

            <p className="text-blue-100 text-sm max-w-sm">
              Register new employees and manage your department's team members effortlessly.
            </p>

            <div className="space-y-4 mt-8">
              {[
                { icon: "User", title: "Employee Registration", description: "Seamlessly add new team members", color: "blue" },
                { icon: "ShieldCheck", title: "Secure Access", description: "Encrypted credentials for security", color: "blue" },
                { icon: "Building2", title: "Automatic Assignment", description: "Directly linked to your department", color: "blue" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-10 h-10 bg-blue-500/20 backdrop-blur-md rounded-xl border border-blue-400/20 flex items-center justify-center shadow-inner`}>
                    <DynamicIcon name={feature.icon} className={`text-blue-300 w-5 h-5`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{feature.title}</p>
                    <p className="text-xs text-blue-200 mt-0.5">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Side - Form & List Scrollable Container */}
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar pb-10 space-y-6">

            {/* Registration Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 relative">
              <div className="text-center mb-6">
                <div className="lg:hidden flex justify-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-xl">
                    👥
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Register New Employee</h2>
                <p className="text-gray-500 text-xs mt-1">Add a new member to your department</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Employee Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DynamicIcon name="User" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 text-sm border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                      placeholder="e.g., John Doe"
                    />
                  </div>
                  {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DynamicIcon name="Mail" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 text-sm border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                      placeholder="employee@company.com"
                    />
                  </div>
                  {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DynamicIcon name="Lock" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-9 py-2 text-sm border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                        placeholder="Min 6 chars"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors.password && <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DynamicIcon name="Lock" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-9 py-2 text-sm border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <div className="relative">
                    <DynamicIcon name="ShieldCheck" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <div className="flex items-start gap-2">
                    <DynamicIcon name="AlertCircle" className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-blue-700 text-xs font-semibold">Important Notes:</p>
                      <ul className="text-gray-600 text-xs mt-1 space-y-1">
                        <li>• This employee will be automatically assigned to your department.</li>
                        <li>• The employee can log in using their email and password.</li>
                        <li>• Passwords are encrypted securely.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {formLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <DynamicIcon name="CheckCircle" className="w-4 h-4" />
                    )}
                    {formLoading ? 'Registering...' : 'Register Employee'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition-all duration-200"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Employee List Card (Removed in this file) */}

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default RegisterEmployee;
