import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceExpired = () => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    // Redirect to purchase/subscription page or external link
    // For now, navigate to home where purchase flow could be placed
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-pink-600 p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-800 mb-4">Service Expired</h1>
        <p className="text-lg text-gray-700 mb-6">Your subscription has expired. Please purchase a subscription to regain access.</p>
        <button
          onClick={handlePurchase}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
        >
          Purchase Subscription
        </button>
      </div>
    </div>
  );
};

export default ServiceExpired;
