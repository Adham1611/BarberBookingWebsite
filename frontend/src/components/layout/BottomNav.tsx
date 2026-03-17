import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';

export default function BottomNav() {
  const t = useTranslation();

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <NavLink to="/home">{t('bottomNav', 'home')}</NavLink>
      <NavLink to="/booking">{t('bottomNav', 'book')}</NavLink>
      <NavLink to="/dashboard">{t('bottomNav', 'appointments')}</NavLink>
      <NavLink to="/admin">{t('bottomNav', 'admin')}</NavLink>
    </nav>
  );
}
