import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import AppointmentCard from '../components/cards/AppointmentCard';
import BookingCard from '../components/cards/BookingCard';
import { bookingHistory, upcomingAppointments } from '../data/mockData';
import { useTranslation } from '../context/LanguageContext';

export default function CustomerDashboardPage() {
  const t = useTranslation();

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-content">
        <section>
          <h1>{t('dashboard', 'myAppointments')}</h1>
          <div className="grid stats-row">
            <BookingCard title={t('dashboard', 'stats.upcoming')} value={`${upcomingAppointments.length}`} />
            <BookingCard title={t('dashboard', 'stats.completed')} value={`${bookingHistory.length}`} />
            <BookingCard title={t('dashboard', 'stats.loyaltyPoints')} value="240" />
          </div>
        </section>

        <section>
          <h2>{t('dashboard', 'upcomingAppointments')}</h2>
          <div className="stack">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </section>

        <section>
          <h2>{t('dashboard', 'bookingHistory')}</h2>
          <div className="stack">
            {bookingHistory.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
