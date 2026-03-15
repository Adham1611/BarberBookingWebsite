import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelection() {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();

  const handleLanguageSelect = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex flex-col items-center justify-center px-4">
      <div className="mb-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gold/10 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gold"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Barber Pro</h1>
        <p className="text-gray-400">Premium Booking System</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => handleLanguageSelect('en')}
          className="w-full py-4 px-6 bg-gold text-black font-semibold rounded-xl hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          English
        </button>
        <button
          onClick={() => handleLanguageSelect('ar')}
          className="w-full py-4 px-6 bg-gold text-black font-semibold rounded-xl hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          العربية
        </button>
      </div>

      <div className="mt-16 absolute bottom-8 text-gray-600 text-sm">
        <p>Select your preferred language to get started</p>
      </div>
    </div>
  );
}