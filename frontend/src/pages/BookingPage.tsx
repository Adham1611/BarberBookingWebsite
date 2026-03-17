import { useMemo, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Button from '../components/ui/Button';
import Calendar from '../components/booking/Calendar';
import Modal from '../components/ui/Modal';
import { barbers, services, weekSlots } from '../data/mockData';
import { useTranslation } from '../context/LanguageContext';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState(services[0].id);
  const [barberId, setBarberId] = useState(barbers[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(weekSlots[0]);
  const [open, setOpen] = useState(false);
  const t = useTranslation();

  const steps = [t('booking', 'step1'), t('booking', 'step2'), t('booking', 'step3'), t('booking', 'step4'), t('booking', 'step5')];

  const selectedService = useMemo(() => services.find((s) => s.id === serviceId), [serviceId]);
  const selectedBarber = useMemo(() => barbers.find((b) => b.id === barberId), [barberId]);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-content">
        <section className="booking-panel">
          <div className="section-head">
            <h1>{t('booking', 'title')}</h1>
          </div>
          <div className="stepper">
            {steps.map((label, idx) => (
              <div key={label} className={`step ${idx + 1 <= step ? 'active' : ''}`}>
                <span>{idx + 1}</span>
                <p>{label}</p>
              </div>
            ))}
          </div>

          <div className="booking-grid">
            <section className="card booking-block">
              <h3>{t('booking', 'step1')}</h3>
              <div className="selector-list">
                {services.map((service) => (
                  <button
                    key={service.id}
                    className={`selector ${service.id === serviceId ? 'active' : ''}`}
                    onClick={() => {
                      setServiceId(service.id);
                      setStep(Math.max(step, 2));
                    }}
                  >
                    <span>{service.name}</span>
                    <strong>${service.price}</strong>
                  </button>
                ))}
              </div>
            </section>

            <section className="card booking-block">
              <h3>{t('booking', 'step2')}</h3>
              <div className="selector-list">
                {barbers.map((barber) => (
                  <button
                    key={barber.id}
                    className={`selector ${barber.id === barberId ? 'active' : ''}`}
                    onClick={() => {
                      setBarberId(barber.id);
                      setStep(Math.max(step, 3));
                    }}
                  >
                    <span>{barber.name}</span>
                    <strong>★ {barber.rating}</strong>
                  </button>
                ))}
              </div>
            </section>

            <section className="card booking-block">
              <h3>{t('booking', 'step3')}</h3>
              <Calendar
                selectedDate={date}
                onSelectDate={(value) => {
                  setDate(value);
                  setStep(Math.max(step, 4));
                }}
              />
            </section>

            <section className="card booking-block">
              <h3>{t('booking', 'step4')}</h3>
              <div className="time-slots">
                {weekSlots.map((slot) => (
                  <button
                    key={slot}
                    className={`slot ${slot === timeSlot ? 'active' : ''}`}
                    onClick={() => {
                      setTimeSlot(slot);
                      setStep(5);
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <section className="card confirm-block">
            <h3>{t('booking', 'step5')}</h3>
            <p>{selectedService?.name} {t('booking', 'barber')} {selectedBarber?.name}</p>
            <p>{date} {t('booking', 'time')} {timeSlot}</p>
            <Button onClick={() => setOpen(true)}>{t('booking', 'confirmButton')}</Button>
          </section>
        </section>
      </main>
      <BottomNav />

      <Modal open={open} title={t('booking', 'bookingConfirmed')} onClose={() => setOpen(false)}>
        <p>{t('booking', 'bookingConfirmedMessage')}</p>
        <p style={{ marginTop: 8 }}>
          {selectedService?.name} {t('booking', 'barber')} {selectedBarber?.name} {t('booking', 'date')} {date} {t('booking', 'time')} {timeSlot}
        </p>
      </Modal>
    </div>
  );
}
