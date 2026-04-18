// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ConstantApi from '../services/endpoints';
// import { useDispatch } from 'react-redux';
// import API from '../services/axiosConfig.js';
// import { setCredentials } from '../store/authSlice.js';
// // SVG Icons as inline components (no external icon library)

// const Icons = {
//   Mail: ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//     </svg>
//   ),
//   Lock: ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V8a4 4 0 00-8 0v3h8z" />
//     </svg>
//   ),
//   Eye: ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//     </svg>
//   ),
//   EyeOff: ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//     </svg>
//   ),
//   UserCheck: ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
//   ),
//   Phone: ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//     </svg>
//   )
// };

// // Static Configuration
// const LoginConfig = {
//   page: {
//     title: "Factory Manager",
//     subtitle: "Enterprise Management System",
//     welcomeTitle: "Welcome Back",
//     welcomeSubtitle: "Sign in to your account",
//     footerText: "© 2024 Factory Manager. All rights reserved.",
//     footerSubtext: "Secure login • Role-based access • Real-time updates"
//   },
//   branding: {
//     logoIcon: "🏭",
//     gradientFrom: "from-blue-900",
//     gradientVia: "via-blue-800",
//     gradientTo: "to-indigo-900",
//     brandGradientFrom: "from-blue-400",
//     brandGradientTo: "to-blue-600",
//     buttonGradientFrom: "from-blue-600",
//     buttonGradientTo: "to-blue-700",
//     buttonHoverFrom: "from-blue-700",
//     buttonHoverTo: "to-blue-800",
//     accentColor: "blue",
//     textColor: "white",
//     textSecondary: "blue-200"
//   },
//   hero: {
//     title: "Smart Factory",
//     titleHighlight: "Management Dashboard",
//     description: "Real-time tracking, quality control, and team collaboration at your fingertips.",
//     features: [
//       {
//         icon: "UserCheck",
//         title: "Role-Based Access",
//         description: "Admin | Supervisor | Operator",
//         color: "blue"
//       },
//       {
//         icon: "Mail",
//         title: "Real-time Updates",
//         description: "Live instructions & notifications",
//         color: "blue"
//       },
//       {
//         icon: "Phone",
//         title: "Multi-Channel Alerts",
//         description: "Email | WhatsApp | Push",
//         color: "blue"
//       }
//     ]
//   },
//   form: {
//     email: {
//       label: "Email Address",
//       placeholder: "admin@factory.com",
//       type: "email",
//       required: true
//     },
//     password: {
//       label: "Password",
//       placeholder: "••••••••",
//       required: true
//     },
//     rememberMe: {
//       label: "Remember me",
//       defaultChecked: false
//     },
//     forgotPassword: {
//       label: "Forgot Password?",
//       link: "#"
//     },
//     submitButton: {
//       text: "Sign In",
//       loadingText: "Signing in..."
//     }
//   },
//   demoAccounts: {
//     enabled: true,
//     title: "Demo Credentials (Click to auto-fill)",
//     passwordHint: "Password for all demo accounts: ",
//     defaultPassword: "123456",
//     accounts: [
//       {
//         id: "admin",
//         email: "admin@factory.com",
//         label: "Admin",
//         color: "purple",
//         role: "Admin",
//         department: "Admin"
//       },
//       {
//         id: "supervisor",
//         email: "supervisor@factory.com",
//         label: "Supervisor",
//         color: "blue",
//         role: "Supervisor",
//         department: "QC"
//       },
//       {
//         id: "operator",
//         email: "operator@factory.com",
//         label: "Operator",
//         color: "green",
//         role: "Operator",
//         department: "QC"
//       }
//     ]
//   },
//   background: {
//     type: "gradient",
//     gradientColors: [
//       { color: "from-blue-900 via-blue-800 to-indigo-900", opacity: "opacity-10" },
//       { color: "bg-blue-400", size: "w-96 h-96", blur: "blur-3xl", position: "top-0 left-0" },
//       { color: "bg-purple-400", size: "w-96 h-96", blur: "blur-3xl", position: "bottom-0 right-0" },
//       { color: "bg-yellow-400", size: "w-64 h-64", blur: "blur-3xl", position: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" }
//     ],
//     overlay: "opacity-10"
//   },
//   layout: {
//     containerMaxWidth: "max-w-6xl",
//     gridCols: "md:grid-cols-2",
//     spacing: "gap-8",
//     padding: "p-4",
//     formPadding: "p-8 md:p-10",
//     formBg: "bg-white/95",
//     formBlur: "backdrop-blur-sm",
//     formShadow: "shadow-2xl",
//     formRadius: "rounded-2xl"
//   },
//   animations: {
//     buttonHover: "hover:from-blue-700 hover:to-blue-800",
//     transitionDuration: "duration-200",
//     shadowIntensity: "shadow-lg shadow-blue-500/30"
//   },
//   validation: {
//     emailPattern: /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/,
//     minPasswordLength: 6
//   },
//   // Dummy API Data
//   dummyApi: {
//     users: {
//       'admin@factory.com': { name: 'Admin User', role: 'Admin', department: 'Admin', token: 'dummy-admin-token-123', password: '123456' },
//       'supervisor@factory.com': { name: 'Supervisor', role: 'Supervisor', department: 'QC', token: 'dummy-supervisor-token-123', password: '123456' },
//       'operator@factory.com': { name: 'Operator', role: 'Operator', department: 'QC', token: 'dummy-operator-token-123', password: '123456' }
//     },
//     defaultPassword: '123456'
//   },
//   messages: {
//     loginSuccess: "Login successful 🔥",
//     loginFailed: "Login failed ❌",
//     invalidCredentials: "Invalid email or password",
//     networkError: "Network error. Please try again."
//   }
// };

// // Helper function to get icon component
// const getIcon = (iconName) => {
//   switch(iconName) {
//     case 'Mail': return Icons.Mail;
//     case 'Lock': return Icons.Lock;
//     case 'UserCheck': return Icons.UserCheck;
//     case 'Phone': return Icons.Phone;
//     default: return null;
//   }
// };

// // Dynamic Icon Component
// const DynamicIcon = ({ name, className }) => {
//   const IconComponent = getIcon(name);
//   if (!IconComponent) return null;
//   return <IconComponent className={className} />;
// };

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(LoginConfig.form.rememberMe.defaultChecked);
//   const [formErrors, setFormErrors] = useState({});
//   const [toastMessage, setToastMessage] = useState(null);
//   const [toastType, setToastType] = useState('success');
//   const dispatch = useDispatch() 
  
//   const navigate = useNavigate();

//   // Simple toast notification
//   const showToast = (message, type = 'success') => {
//     setToastMessage(message);
//     setToastType(type);
//     setTimeout(() => {
//       setToastMessage(null);
//     }, 3000);
//   };

//   // Load saved credentials
//   useEffect(() => {
//     const savedEmail = localStorage.getItem('rememberedEmail');
//     const savedPassword = localStorage.getItem('rememberedPassword');
//     if (savedEmail && savedPassword) {
//       setEmail(savedEmail);
//       setPassword(savedPassword);
//       setRememberMe(true);
//     }
//   }, []);

//   // Validate form
//   const validateForm = () => {
//     const errors = {};
    
//     if (!email) {
//       errors.email = 'Email is required';
//     } else if (!LoginConfig.validation.emailPattern.test(email)) {
//       errors.email = 'Please enter a valid email address';
//     }
    
//     if (!password) {
//       errors.password = 'Password is required';
//     } else if (password.length < LoginConfig.validation.minPasswordLength) {
//       errors.password = `Password must be at least ${LoginConfig.validation.minPasswordLength} characters`;
//     }
    
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const trimmedEmail = email.trim();
//     const trimmedPassword = password.trim();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     try {
//       setLoading(true);
      
//       console.log(trimmedEmail, trimmedPassword)
      
      
//       const res = await API.post(ConstantApi.auth.login, { email: trimmedEmail, password: trimmedPassword })

//       console.log("login response" , res)

//       if (res.data.success) {
//           dispatch(setCredentials({ department: res.data.department, token: res.data.token }))


//         if (rememberMe) {
//           localStorage.setItem('rememberedEmail', trimmedEmail);
//           localStorage.setItem('rememberedPassword', trimmedPassword);
//         } else {
//           localStorage.removeItem('rememberedEmail');
//           localStorage.removeItem('rememberedPassword');
//         }
        
//         // Store authentication data
//         localStorage.setItem('token', res.data.token);
//         localStorage.setItem('department', JSON.stringify(res.data.department));
        
//         showToast(LoginConfig.messages.loginSuccess, 'success');
        
//         // Redirect after short delay
//         setTimeout(() => {
//           navigate('/dashboard');
//         }, 500);
//       } else {
//         showToast(result.error || LoginConfig.messages.loginFailed, 'error');
//       }
//     } catch (error) {
//       showToast(error.response.data.message, 'error');
//       console.error('Login error:', error.response);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const quickLogin = (userEmail, userPassword = LoginConfig.demoAccounts.defaultPassword) => {
//     setEmail(userEmail);
//     setPassword(userPassword);
//     setFormErrors({});
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
//       {/* Toast Notification */}
//       {toastMessage && (
//         <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
//           <div className={`${
//             toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
//           } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
//             {toastType === 'success' ? '✅' : '❌'}
//             <span>{toastMessage}</span>
//           </div>
//         </div>
//       )}

//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative min-h-screen flex items-center justify-center p-4">
//         <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
          
//           {/* Left Side - Branding */}
//           <div className="hidden md:block text-white space-y-6">
//             <div className="flex items-center gap-3 mb-8">
//               <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl text-2xl">
//                 {LoginConfig.branding.logoIcon}
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">{LoginConfig.page.title}</h1>
//                 <p className="text-blue-200 text-sm">{LoginConfig.page.subtitle}</p>
//               </div>
//             </div>

//             <h2 className="text-4xl font-bold leading-tight">
//               {LoginConfig.hero.title}<br />
//               <span className="text-blue-300">{LoginConfig.hero.titleHighlight}</span>
//             </h2>

//             <p className="text-blue-100 text-lg">
//               {LoginConfig.hero.description}
//             </p>

//             <div className="space-y-4 pt-8">
//               {LoginConfig.hero.features.map((feature, index) => (
//                 <div key={index} className="flex items-center gap-3">
//                   <div className={`w-10 h-10 bg-${feature.color}-500/30 rounded-lg flex items-center justify-center`}>
//                     <DynamicIcon name={feature.icon} className={`text-${feature.color}-300 w-5 h-5`} />
//                   </div>
//                   <div>
//                     <p className="font-semibold">{feature.title}</p>
//                     <p className="text-sm text-blue-200">{feature.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Side - Login Form */}
//           <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10">
//             <div className="text-center mb-8">
//               <div className="md:hidden flex justify-center mb-4">
//                 <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-xl">
//                   {LoginConfig.branding.logoIcon}
//                 </div>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800">{LoginConfig.page.welcomeTitle}</h2>
//               <p className="text-gray-500 mt-1">{LoginConfig.page.welcomeSubtitle}</p>
//             </div>

//             <form className="space-y-5" onSubmit={handleSubmit}>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {LoginConfig.form.email.label}
//                 </label>
//                 <div className="relative">
//                   <Icons.Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type={LoginConfig.form.email.type}
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className={`w-full pl-10 pr-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
//                     placeholder={LoginConfig.form.email.placeholder}
//                     required={LoginConfig.form.email.required}
//                   />
//                 </div>
//                 {formErrors.email && (
//                   <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {LoginConfig.form.password.label}
//                 </label>
//                 <div className="relative">
//                   <Icons.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className={`w-full pl-10 pr-12 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
//                     placeholder={LoginConfig.form.password.placeholder}
//                     required={LoginConfig.form.password.required}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 {formErrors.password && (
//                   <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
//                 )}
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                     className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                   />
//                   <span className="text-sm text-gray-600">{LoginConfig.form.rememberMe.label}</span>
//                 </label>
//                 <a href={LoginConfig.form.forgotPassword.link} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
//                   {LoginConfig.form.forgotPassword.label}
//                 </a>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     {LoginConfig.form.submitButton.loadingText}
//                   </div>
//                 ) : (
//                   LoginConfig.form.submitButton.text
//                 )}
//               </button>
//             </form>

//             {/* Demo Credentials */}
//             {LoginConfig.demoAccounts.enabled && (
//               <div className="mt-8 pt-6 border-t border-gray-200">
//                 <p className="text-xs text-center text-gray-500 mb-3">{LoginConfig.demoAccounts.title}</p>
//                 <div className="grid grid-cols-3 gap-2">
//                   {LoginConfig.demoAccounts.accounts.map((account) => (
//                     <button
//                       key={account.id}
//                       onClick={() => quickLogin(account.email, LoginConfig.demoAccounts.defaultPassword)}
//                       className={`px-2 py-1.5 text-xs bg-${account.color}-50 text-${account.color}-700 rounded-lg hover:bg-${account.color}-100 transition`}
//                     >
//                       {account.label}
//                     </button>
//                   ))}
//                 </div>
//                 <p className="text-xs text-center text-gray-400 mt-3">
//                   {LoginConfig.demoAccounts.passwordHint}<span className="font-mono">{LoginConfig.demoAccounts.defaultPassword}</span>
//                 </p>
//               </div>
//             )}

//             {/* Footer */}
//             <div className="mt-6 text-center text-xs text-gray-400">
//               <p>{LoginConfig.page.footerText}</p>
//               <p className="mt-1">{LoginConfig.page.footerSubtext}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add animation keyframes */}
//       <style jsx>{`
//         @keyframes fadeInDown {
//           from {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in-down {
//           animation: fadeInDown 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;



import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConstantApi from '../services/endpoints';
import { useDispatch } from 'react-redux';
import API from '../services/axiosConfig.js';
import { setCredentials } from '../store/authSlice.js';

// SVG Icons as inline components
const Icons = {
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
  UserCheck: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Phone: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
};



// Static Configuration
const LoginConfig = {
  page: {
    title: "Factory Manager",
    subtitle: "Enterprise Management System",
    welcomeTitle: "Welcome Back",
    welcomeSubtitle: "Sign in to your account",
    footerText: "© 2024 Factory Manager. All rights reserved.",
    footerSubtext: "Secure login • Role-based access • Real-time updates"
  },
  branding: {
    logoIcon: "🏭",
    gradientFrom: "from-blue-900",
    gradientVia: "via-blue-800",
    gradientTo: "to-indigo-900",
    brandGradientFrom: "from-blue-400",
    brandGradientTo: "to-blue-600",
    buttonGradientFrom: "from-blue-600",
    buttonGradientTo: "to-blue-700",
    buttonHoverFrom: "from-blue-700",
    buttonHoverTo: "to-blue-800",
    accentColor: "blue",
    textColor: "white",
    textSecondary: "blue-200"
  },
  hero: {
    title: "Smart Factory",
    titleHighlight: "Management Dashboard",
    description: "Real-time tracking, quality control, and team collaboration at your fingertips.",
    features: [
      {
        icon: "UserCheck",
        title: "Role-Based Access",
        description: "Admin | Supervisor | Operator",
        color: "blue"
      },
      {
        icon: "Mail",
        title: "Real-time Updates",
        description: "Live instructions & notifications",
        color: "blue"
      },
      {
        icon: "Phone",
        title: "Multi-Channel Alerts",
        description: "Email | WhatsApp | Push",
        color: "blue"
      }
    ]
  },
  form: {
    email: {
      label: "Email Address",
      placeholder: "admin@factory.com",
      type: "email",
      required: true
    },
    password: {
      label: "Password",
      placeholder: "••••••••",
      required: true
    },
    rememberMe: {
      label: "Remember me",
      defaultChecked: false
    },
    forgotPassword: {
      label: "Forgot Password?",
      link: "#"
    },
    submitButton: {
      text: "Sign In",
      loadingText: "Signing in..."
    }
  },
  demoAccounts: {
    enabled: true,
    title: "Demo Credentials (Click to auto-fill)",
    passwordHint: "Password for all demo accounts: ",
    defaultPassword: "123456",
    accounts: [
      {
        id: "admin",
        email: "admin@factory.com",
        label: "Admin",
        color: "purple",
        role: "Admin",
        department: "Admin"
      },
      {
        id: "supervisor",
        email: "supervisor@factory.com",
        label: "Supervisor",
        color: "blue",
        role: "Supervisor",
        department: "QC"
      },
      {
        id: "operator",
        email: "operator@factory.com",
        label: "Operator",
        color: "green",
        role: "Operator",
        department: "QC"
      }
    ]
  },
  background: {
    type: "gradient",
    gradientColors: [
      { color: "from-blue-900 via-blue-800 to-indigo-900", opacity: "opacity-10" },
      { color: "bg-blue-400", size: "w-96 h-96", blur: "blur-3xl", position: "top-0 left-0" },
      { color: "bg-purple-400", size: "w-96 h-96", blur: "blur-3xl", position: "bottom-0 right-0" },
      { color: "bg-yellow-400", size: "w-64 h-64", blur: "blur-3xl", position: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" }
    ],
    overlay: "opacity-10"
  },
  layout: {
    containerMaxWidth: "max-w-6xl",
    gridCols: "md:grid-cols-2",
    spacing: "gap-8",
    padding: "p-4",
    formPadding: "p-8 md:p-10",
    formBg: "bg-white/95",
    formBlur: "backdrop-blur-sm",
    formShadow: "shadow-2xl",
    formRadius: "rounded-2xl"
  },
  animations: {
    buttonHover: "hover:from-blue-700 hover:to-blue-800",
    transitionDuration: "duration-200",
    shadowIntensity: "shadow-lg shadow-blue-500/30"
  },
  validation: {
    emailPattern: /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/,
    minPasswordLength: 6
  },
  dummyApi: {
    users: {
      'admin@factory.com': { name: 'Admin User', role: 'Admin', department: 'Admin', token: 'dummy-admin-token-123', password: '123456' },
      'supervisor@factory.com': { name: 'Supervisor', role: 'Supervisor', department: 'QC', token: 'dummy-supervisor-token-123', password: '123456' },
      'operator@factory.com': { name: 'Operator', role: 'Operator', department: 'QC', token: 'dummy-operator-token-123', password: '123456' }
    },
    defaultPassword: '123456'
  },
  messages: {
    loginSuccess: "Login successful 🔥",
    loginFailed: "Login failed ❌",
    invalidCredentials: "Invalid email or password",
    networkError: "Network error. Please try again."
  }
};

// Helper function to get icon component
const getIcon = (iconName) => {
  switch(iconName) {
    case 'Mail': return Icons.Mail;
    case 'Lock': return Icons.Lock;
    case 'UserCheck': return Icons.UserCheck;
    case 'Phone': return Icons.Phone;
    default: return null;
  }
};

// Dynamic Icon Component
const DynamicIcon = ({ name, className }) => {
  const IconComponent = getIcon(name);
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(LoginConfig.form.rememberMe.defaultChecked);
  const [formErrors, setFormErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Forget Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Simple toast notification
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Load saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!LoginConfig.validation.emailPattern.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < LoginConfig.validation.minPasswordLength) {
      errors.password = `Password must be at least ${LoginConfig.validation.minPasswordLength} characters`;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      console.log(trimmedEmail, trimmedPassword);
      
      const res = await API.post(ConstantApi.auth.login, { email: trimmedEmail, password: trimmedPassword });

      console.log("login response", res);

      if (res.data.success) {
        dispatch(setCredentials({ department: res.data.department, token: res.data.token }));

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', trimmedEmail);
          localStorage.setItem('rememberedPassword', trimmedPassword);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('department', JSON.stringify(res.data.department));
        
        showToast(LoginConfig.messages.loginSuccess, 'success');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        showToast(result.error || LoginConfig.messages.loginFailed, 'error');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Login failed', 'error');
      console.error('Login error:', error.response);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FORGET PASSWORD FUNCTIONS ====================
  
  const handleSendOtp = async () => {
    if (!forgotEmail) {
      showToast('Please enter your email', 'error');
      return;
    }

    try {
      setForgotLoading(true);
      const res = await API.post(ConstantApi.auth.forgotPassword, { email: forgotEmail });
      console.log(res , " this is response of handleSendOtp")      
      
      if (res.data.success) {
        setForgotStep(2);
        showToast('OTP sent to your email!', 'success');
      } else {
        showToast(res.data.message || 'Failed to send OTP', 'error');
      }
    } catch (error) {
      console.error(error?.response , "error from handleSendOtp");
      showToast(error.response?.data?.message || 'Error sending OTP', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      showToast('Please enter valid 6-digit OTP', 'error');
      return;
    }

    try {
      setForgotLoading(true);
      const res = await API.post(ConstantApi.auth.verifyOtp, { 
        email: forgotEmail, 
        otp: otp 
      });
      console.log(res , " this is response of handleVerifyOtp")
      
      if (res.data.success) {
        setForgotStep(3);
        showToast('OTP verified! Set new password', 'success');
      } else {
        showToast(res.data.message || 'Invalid OTP', 'error');
      }
    } catch (error) {
      console.error(error?.response);
      showToast(error.response?.data?.message || 'OTP verification failed', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      setForgotLoading(true);
      const res = await API.post(ConstantApi.auth.resetPassword, {
        email: forgotEmail,
        otp: otp,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      });
      
      if (res.data.success) {
        showToast('Password reset successfully! Please login', 'success');
        closeForgotModal();
      } else {
        showToast(res.data.message || 'Failed to reset password', 'error');
      }
    } catch (error) {
      console.error(error?.response);
      showToast(error.response?.data?.message || 'Error resetting password', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotStep(1);
    setForgotLoading(false);
  };

  const quickLogin = (userEmail, userPassword = LoginConfig.demoAccounts.defaultPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setFormErrors({});
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
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

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className="hidden md:block text-white space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl text-2xl">
                {LoginConfig.branding.logoIcon}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{LoginConfig.page.title}</h1>
                <p className="text-blue-200 text-sm">{LoginConfig.page.subtitle}</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              {LoginConfig.hero.title}<br />
              <span className="text-blue-300">{LoginConfig.hero.titleHighlight}</span>
            </h2>

            <p className="text-blue-100 text-lg">
              {LoginConfig.hero.description}
            </p>

            <div className="space-y-4 pt-8">
              {LoginConfig.hero.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${feature.color}-500/30 rounded-lg flex items-center justify-center`}>
                    <DynamicIcon name={feature.icon} className={`text-${feature.color}-300 w-5 h-5`} />
                  </div>
                  <div>
                    <p className="font-semibold">{feature.title}</p>
                    <p className="text-sm text-blue-200">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="md:hidden flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-xl">
                  {LoginConfig.branding.logoIcon}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{LoginConfig.page.welcomeTitle}</h2>
              <p className="text-gray-500 mt-1">{LoginConfig.page.welcomeSubtitle}</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {LoginConfig.form.email.label}
                </label>
                <div className="relative">
                  <Icons.Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={LoginConfig.form.email.type}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                    placeholder={LoginConfig.form.email.placeholder}
                    required={LoginConfig.form.email.required}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {LoginConfig.form.password.label}
                </label>
                <div className="relative">
                  <Icons.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                    placeholder={LoginConfig.form.password.placeholder}
                    required={LoginConfig.form.password.required}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">{LoginConfig.form.rememberMe.label}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {LoginConfig.form.forgotPassword.label}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {LoginConfig.form.submitButton.loadingText}
                  </div>
                ) : (
                  LoginConfig.form.submitButton.text
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            {LoginConfig.demoAccounts.enabled && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500 mb-3">{LoginConfig.demoAccounts.title}</p>
                <div className="grid grid-cols-3 gap-2">
                  {LoginConfig.demoAccounts.accounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => quickLogin(account.email, LoginConfig.demoAccounts.defaultPassword)}
                      className={`px-2 py-1.5 text-xs bg-${account.color}-50 text-${account.color}-700 rounded-lg hover:bg-${account.color}-100 transition`}
                    >
                      {account.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-center text-gray-400 mt-3">
                  {LoginConfig.demoAccounts.passwordHint}<span className="font-mono">{LoginConfig.demoAccounts.defaultPassword}</span>
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-gray-400">
              <p>{LoginConfig.page.footerText}</p>
              <p className="mt-1">{LoginConfig.page.footerSubtext}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Reset Password</h3>
              <button
                onClick={closeForgotModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Step 1: Enter Email */}
            {forgotStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Enter your registered email address. We'll send you an OTP to reset your password.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={forgotLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            )}

            {/* Step 2: Verify OTP */}
            {forgotStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  We've sent a 6-digit OTP to <strong>{forgotEmail}</strong>
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={forgotLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {forgotLoading ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  onClick={() => setForgotStep(1)}
                  className="w-full text-blue-600 text-sm hover:underline"
                >
                  ← Back to email
                </button>
              </div>
            )}

            {/* Step 3: Set New Password */}
            {forgotStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Set a new password for <strong>{forgotEmail}</strong>
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={forgotLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animation keyframes */}
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

export default Login;