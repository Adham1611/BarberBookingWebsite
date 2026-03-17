import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';

export default function Sidebar() {
  const t = useTranslation();

  return (
    <aside className="sidebar">
      <h3>{t('admin', 'overview')}</h3>
      <NavLink to="/admin">{t('admin', 'overview')}</NavLink>
      <a href="#bookings">{t('admin', 'bookings')}</a>
      <a href="#services">{t('admin', 'services')}</a>
      <a href="#barbers">{t('admin', 'barbers')}</a>
      <a href="#analytics">{t('admin', 'analytics')}</a>
    </aside>
  );
}
