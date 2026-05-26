import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConstantApi from '../services/endpoints';
import API from '../services/axiosConfig';

// SVG Icons as inline components (no external icon library)
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
  Phone: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  FileText: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

// Helper function to get icon component
const getIcon = (iconName) => {
  switch(iconName) {
    case 'Building2': return Icons.Building2;
    case 'Mail': return Icons.Mail;
    case 'Lock': return Icons.Lock;
    case 'User': return Icons.User;
    case 'Phone': return Icons.Phone;
    case 'FileText': return Icons.FileText;
    case 'CheckCircle': return Icons.CheckCircle;
    case 'AlertCircle': return Icons.AlertCircle;
    default: return null;
  }
};

const DynamicIcon = ({ name, className }) => {
  const IconComponent = getIcon(name);
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    department: '',      // Changed from 'name' to 'department' (matches schema)
    email: '',
    password: '',
    confirmPassword: '',
    description: '',
    phone: '',
    headName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.department.trim()) {
      errors.department = "Department name is required";
    }
    
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
    
  if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
  errors.phone = "Enter a valid 10-digit phone number starting with 6-9";
}
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const departmentData = {
        department: formData.department.toUpperCase(), // Schema has uppercase: true
        email: formData.email.toLowerCase(),           // Schema has lowercase: true
        password: formData.password,
        description: formData.description || '',
        phone: formData.phone || '',
        headName: formData.headName || '',
        role: formData.department.toUpperCase() === 'ADMIN' ? 'admin' : 'department' // Auto set role
      };
      
      console.log("Sending data:", departmentData);
      
      // Replace with your actual API endpoint
      const response = await API.post(ConstantApi.admin.registerDeparment , departmentData);
      console.log( response , " this is my register response")
      
      if (response.data.success) {
        showToast(response.data.message || `Department "${formData.department}" registered successfully!`, 'success');
        // Reset form
        setFormData({
          department: '',
          email: '',
          password: '',
          confirmPassword: '',
          description: '',
          phone: '',
          headName: ''
        });
        setFormErrors({});
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error registering department";
      showToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      department: '',
      email: '',
      password: '',
      confirmPassword: '',
      description: '',
      phone: '',
      headName: ''
    });
    setFormErrors({});
  };

  return (
    <div className="h-full relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <button
  onClick={() => navigate(-1)}
  className="fixed top-4 left-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200 shadow-lg z-50"
  aria-label="Back to Dashboard"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
</button>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className={`${
            toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
            {toastType === 'success' ? '✅' : '❌'}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative h-full flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-6 items-center">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:block text-white space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl text-2xl">
                🏭
              </div>
              <div>
                <h1 className="text-xl font-bold">Factory Manager</h1>
                <p className="text-blue-200 text-xs">Enterprise Management System</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold leading-tight">
              Department<br />
              <span className="text-blue-300">Management</span>
            </h2>

            <p className="text-blue-100 text-sm">
              Create and manage departments efficiently. Set up roles, assign heads, and track performance.
            </p>

            <div className="space-y-3">
              {[
                { icon: "Building2", title: "Department Management", description: "Create and manage departments", color: "blue" },
                { icon: "User", title: "Role-Based Access", description: "Department head & members", color: "blue" },
                { icon: "FileText", title: "Task Assignment", description: "Assign tasks across departments", color: "blue" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-8 h-8 bg-${feature.color}-500/30 rounded-lg flex items-center justify-center`}>
                    <DynamicIcon name={feature.icon} className={`text-${feature.color}-300 w-4 h-4`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{feature.title}</p>
                    <p className="text-xs text-blue-200">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="text-center mb-5">
              <div className="lg:hidden flex justify-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-xl">
                  🏭
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Register New Department</h2>
              <p className="text-gray-500 text-xs mt-1">Only Admin can register new departments</p>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Department Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DynamicIcon name="Building2" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2 text-sm border ${formErrors.department ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase`}
                    placeholder="e.g., QC, DESIGN, IT, SALES, ADMIN"
                    required
                  />
                </div>
                {formErrors.department && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.department}</p>
                )}
                <p className="mt-0.5 text-xs text-gray-400">Department name will be displayed in uppercase</p>
              </div>

              {/* Head Name & Phone - Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Head Name
                  </label>
                  <div className="relative">
                    <DynamicIcon name="User" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="headName"
                      value={formData.headName}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Department head name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <DynamicIcon name="Phone" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      className={`w-full pl-9 pr-3 py-2 text-sm border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                      placeholder="10-digit phone number"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>
                  )}
                </div>
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
                    className={`w-full pl-9 pr-3 py-2 text-sm border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                    placeholder="department@company.com"
                    required
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
                )}
                <p className="mt-0.5 text-xs text-gray-400">This will be used for department login</p>
              </div>

              {/* Password & Confirm Password - Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      className={`w-full pl-9 pr-9 py-2 text-sm border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                      placeholder="Minimum 6 characters"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
                  )}
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
                      className={`w-full pl-9 pr-9 py-2 text-sm border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="relative">
                  <DynamicIcon name="FileText" className="absolute left-3 top-2 text-gray-400 w-4 h-4" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    placeholder="Department responsibilities and description..."
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <div className="flex items-start gap-2">
                  <DynamicIcon name="AlertCircle" className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-blue-700 text-xs font-semibold">Important Notes:</p>
                    <ul className="text-gray-600 text-xs mt-0.5 space-y-0.5">
                      <li>• Department will be created with role = "department"</li>
                      <li>• For ADMIN department, role will be set to "admin" automatically</li>
                      <li>• Department can login using email and password</li>
                      <li>• Department can assign tasks to other departments</li>
                      <li>• Only Admin can register new departments</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Registering...
                    </>
                  ) : (
                    <>
                      <DynamicIcon name="CheckCircle" className="w-4 h-4" />
                      Register Department
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg text-sm transition-all duration-200"
                >
                  Clear
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-4 text-center text-xs text-gray-400">
              <p>© 2024 Factory Manager. All rights reserved.</p>
              <p className="mt-0.5">Secure registration • Role-based access • Real-time updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="fixed bottom-4 left-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200 shadow-lg"
        aria-label="Back to Dashboard"
      >
        <DynamicIcon name="ArrowLeft" className="w-4 h-4" />
      </button>

      {/* Admin Profile Button */}
      <button
        onClick={() => navigate('/admin/profile')}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full px-4 py-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
        aria-label="Admin Profile"
      >
        Admin Profile
      </button>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Register;