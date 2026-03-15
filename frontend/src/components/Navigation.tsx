import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navigation() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, isArabic } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900/95 backdrop-blur border-b border-gray-700 sticky top-0 z-50">
      <div className={`max-w-6xl mx-auto px-4 py-4 flex justify-between items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
        <div
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center group-hover:bg-gold/30 transition-colors">
            <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
          </div>
          <span className="font-bold text-white hidden sm:block">Barber Pro</span>
        </div>

        <div className={`hidden md:flex items-center gap-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => navigate('/home')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/booking')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Book
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Admin
          </button>

          <div className={`flex gap-2 border-l border-gray-700 pl-8 ${isArabic ? 'flex-row-reverse border-l-0 border-r border-gray-700 pr-8' : ''}`}>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                language === 'en'
                  ? 'bg-gold text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                language === 'ar'
                  ? 'bg-gold text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              AR
            </button>
          </div>

          {user ? (
            <button
              onClick={() => {
                logout();
                navigate('/welcome');
              }}
              className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth?mode=login')}
              className="px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Login
            </button>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 py-4 px-4 space-y-3">
          <button onClick={() => navigate('/home')} className="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            Home
          </button>
          <button onClick={() => navigate('/booking')} className="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            Book
          </button>
          <button onClick={() => navigate('/admin')} className="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            Admin
          </button>
          {user ? (
            <button onClick={() => { logout(); navigate('/welcome'); }} className="block w-full text-left px-4 py-2 bg-red-900 text-white rounded-lg">
              Logout
            </button>
          ) : (
            <button onClick={() => navigate('/auth?mode=login')} className="block w-full text-left px-4 py-2 bg-gold text-black rounded-lg">
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}