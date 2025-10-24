import React from 'react';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="flex items-center justify-center mb-4">
        <Shield className="w-16 h-16 text-purple-400 animate-bounce" />
      </div>
      <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
        Aadhaar Forgery Detector
      </h1>
      <p className="text-gray-400 text-lg mb-4">AI-Powered Document Authentication System</p>
    </div>
  );
};

export default Header;