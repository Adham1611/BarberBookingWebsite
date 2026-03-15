import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Pages
import LanguageSelection from './pages/LanguageSelection';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  useEffect(() => {
    const language = localStorage.getItem('language') || 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, []);

  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <BookingProvider>
            <Routes>
              <Route path="/" element={<LanguageSelection />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/home" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BookingProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;