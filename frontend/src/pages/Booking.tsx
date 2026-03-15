import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navigation from '../components/Navigation';

const SERVICES = [
  { id: '1', name: 'Haircut', price: '$30', duration: '30 min' },
  { id: '2', name: 'Beard Trim', price: '$20', duration: '20 min' },
  { id: '3', name: 'Hair + Beard Package', price: '$45', duration: '50 min' },
  { id: '4', name: 'Skin Fade', price: '$35', duration: '35 min' },
  { id: '5', name: 'Kids Haircut', price: '$20', duration: '25 min' },
];

const BARBERS = [
  { id: '1', name: 'Alex Johnson' },
  { id: '2', name: 'Marcus Smith' },
  { id: '3', name: 'David Brown' },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

export default function Booking() {
  const navigate = useNavigate();
  const { addBooking } = useBooking();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirm = () => {
    const booking = {
      id: Math.random().toString(36).substr(2, 9),
      serviceId: selectedService,
      barberId: selectedBarber,
      date: selectedDate,
      time: selectedTime,
      status: 'upcoming' as const,
      customerName,
      customerPhone,
    };

    addBooking(booking);
    navigate('/dashboard');
  };

  const getProgressPercentage = () => {
    return (step / 5) * 100;
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between mb-4 text-sm text-gray-400">
            <span>{t('booking.step')} {step} {t('booking.of')} 5</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gold h-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              {t('booking.chooseService')}
            </h2>
            {SERVICES.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                  selectedService === service.id
                    ? 'border-gold bg-gray-900'
                    : 'border-gray-700 bg-gray-950 hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white">{service.name}</h3>
                    <p className="text-sm text-gray-400">{service.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold">{service.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              {t('booking.chooseBarber')}
            </h2>
            {BARBERS.map((barber) => (
              <div
                key={barber.id}
                onClick={() => setSelectedBarber(barber.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                  selectedBarber === barber.id
                    ? 'border-gold bg-gray-900'
                    : 'border-gray-700 bg-gray-950 hover:border-gray-600'
                }`}
              >
                <h3 className="font-semibold text-white">{barber.name}</h3>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              {t('booking.chooseDate')}
            </h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              {t('booking.chooseTime')}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 rounded-lg font-semibold transition-all duration-300 ${
                    selectedTime === time
                      ? 'bg-gold text-black'
                      : 'bg-gray-900 text-white border border-gray-700 hover:border-gold'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              {t('booking.confirm')}
            </h2>
            <div className="bg-gray-900 rounded-lg p-6 space-y-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm">{t('common.book')}</p>
                <p className="text-white font-semibold">
                  {SERVICES.find((s) => s.id === selectedService)?.name}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">{t('common.name')}</p>
                <p className="text-white font-semibold">
                  {BARBERS.find((b) => b.id === selectedBarber)?.name}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date & Time</p>
                <p className="text-white font-semibold">
                  {selectedDate} at {selectedTime}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  {t('auth.fullName')}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  {t('common.phone')}
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                  placeholder="Your phone"
                  required
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              {t('common.back')}
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedService) ||
                (step === 2 && !selectedBarber) ||
                (step === 3 && !selectedDate) ||
                (step === 4 && !selectedTime)
              }
              className="flex-1 px-6 py-3 bg-gold hover:bg-yellow-500 text-black font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.next')}
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={!customerName || !customerPhone}
              className="flex-1 px-6 py-3 bg-gold hover:bg-yellow-500 text-black font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.confirm')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}