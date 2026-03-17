import type { Appointment } from '../../types';
import Button from '../ui/Button';
import { useTranslation } from '../../context/LanguageContext';

type Props = {
  appointment: Appointment;
};

export default function AppointmentCard({ appointment }: Props) {
  const t = useTranslation();

  return (
    <article className="card appointment-card">
      <div>
        <h3>{appointment.serviceName}</h3>
        <p>{t('booking', 'barber')} {appointment.barberName}</p>
      </div>
      <div className="appointment-meta">
        <span>{appointment.date}</span>
        <span>{appointment.time}</span>
        <span>${appointment.price}</span>
      </div>
      {appointment.status === 'upcoming' ? (
        <div className="appointment-actions">
          <Button variant="secondary">{t('dashboard', 'reschedule')}</Button>
          <Button variant="ghost">{t('dashboard', 'cancel')}</Button>
        </div>
      ) : (
        <span className="status-pill">{appointment.status === 'completed' ? t('dashboard', 'completed') : t('dashboard', 'cancelled')}</span>
      )}
    </article>
  );
}
