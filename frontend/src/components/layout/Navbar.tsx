import { Link, NavLink } from 'react-router-dom';
import Button from '../ui/Button';
import { useLanguage, useTranslation } from '../../context/LanguageContext';
import { useState } from 'react';

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  return (
    <header className="navbar">
      <Link to="/home" className="brand">
        <span className="brand-mark">✦</span>
        {t('nav', 'crownCut')}
      </Link>

      <nav className="nav-links">
        <NavLink to="/home">{t('nav', 'home')}</NavLink>
        <NavLink to="/booking">{t('booking', 'title')}</NavLink>
        <NavLink to="/dashboard">{t('dashboard', 'myAppointments')}</NavLink>
        <NavLink to="/admin">{t('nav', 'admin')}</NavLink>
      </nav>

      <div className="nav-actions">
        <div style={{ position: 'relative' }}>
          <Button 
            variant="ghost"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          >
            {language === 'ar' ? 'العربية' : 'EN'}
          </Button>
          {showLanguageMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              overflow: 'hidden',
              zIndex: 1000,
              minWidth: '120px',
            }}>
              <button
                onClick={() => {
                  setLanguage('en');
                  setShowLanguageMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  background: language === 'en' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                }}
              >
                English
              </button>
              <button
                onClick={() => {
                  setLanguage('ar');
                  setShowLanguageMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  borderTop: '1px solid var(--line)',
                  background: language === 'ar' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                }}
              >
                العربية
              </button>
            </div>
          )}
        </div>
        <Button>{t('nav', 'bookNow')}</Button>
      </div>
    </header>
  );
}
