import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Button from '../components/ui/Button';
import ServiceCard from '../components/cards/ServiceCard';
import BarberCard from '../components/cards/BarberCard';
import Modal from '../components/ui/Modal';
import { barbers, services } from '../data/mockData';
import { useTranslation } from '../context/LanguageContext';

export default function HomePage() {
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const navigate = useNavigate();
  const t = useTranslation();

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-content">
        <section className="hero-banner">
          <div>
            <p className="eyebrow">Luxury Barber SaaS</p>
            <h1>{t('home', 'heroBanner')}</h1>
            <p>{t('home', 'heroSubtitle')}</p>
            <Button onClick={() => navigate('/booking')}>{t('booking', 'title')}</Button>
          </div>
          <div className="hero-shine" />
        </section>

        <section>
          <div className="section-head">
            <h2>{t('home', 'services')}</h2>
            <Button variant="ghost" onClick={() => setBookModalOpen(true)}>
              {t('home', 'quickBook')}
            </Button>
          </div>
          <div className="grid cards-grid">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2>{t('home', 'topBarbers')}</h2>
          </div>
          <div className="grid cards-grid">
            {barbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} />
            ))}
          </div>
        </section>
      </main>
      <BottomNav />

      <Modal open={bookModalOpen} title={t('home', 'quickBook')} onClose={() => setBookModalOpen(false)}>
        <p>{t('home', 'selectBarber')}</p>
        <div className="row" style={{ marginTop: 16 }}>
          <Button onClick={() => navigate('/booking')}>{t('home', 'startBooking')}</Button>
          <Button variant="secondary" onClick={() => setBookModalOpen(false)}>
            {t('common', 'close')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
