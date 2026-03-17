import type { Appointment, Barber, Service, StatCard } from '../types';

export const services: Service[] = [
  { id: 'srv1', name: 'Haircut', price: 20, duration: 30, icon: '✂️' },
  { id: 'srv2', name: 'Beard Trim', price: 15, duration: 20, icon: '🧔' },
  { id: 'srv3', name: 'Hair + Beard Package', price: 30, duration: 50, icon: '🔥' },
  { id: 'srv4', name: 'Skin Fade', price: 28, duration: 40, icon: '💈' },
  { id: 'srv5', name: 'Kids Haircut', price: 12, duration: 25, icon: '🧒' },
];

export const barbers: Barber[] = [
  {
    id: 'bar1',
    name: 'Omar Hassan',
    rating: 4.9,
    specialty: 'Skin Fade & Precision Lines',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'bar2',
    name: 'Youssef Karim',
    rating: 4.8,
    specialty: 'Classic Cuts & Beard Sculpting',
    image: 'https://images.unsplash.com/photo-1593702288056-f0f2ea0a3b96?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'bar3',
    name: 'Ali Mostafa',
    rating: 4.7,
    specialty: 'Kids Cuts & Modern Styling',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  },
];

export const upcomingAppointments: Appointment[] = [
  {
    id: 'apt1',
    serviceName: 'Hair + Beard Package',
    barberName: 'Omar Hassan',
    date: '2026-03-21',
    time: '18:30',
    price: 30,
    status: 'upcoming',
  },
  {
    id: 'apt2',
    serviceName: 'Skin Fade',
    barberName: 'Youssef Karim',
    date: '2026-03-27',
    time: '15:00',
    price: 28,
    status: 'upcoming',
  },
];

export const bookingHistory: Appointment[] = [
  {
    id: 'apt3',
    serviceName: 'Haircut',
    barberName: 'Ali Mostafa',
    date: '2026-03-02',
    time: '16:00',
    price: 20,
    status: 'completed',
  },
  {
    id: 'apt4',
    serviceName: 'Beard Trim',
    barberName: 'Omar Hassan',
    date: '2026-02-19',
    time: '20:00',
    price: 15,
    status: 'completed',
  },
];

export const adminStats: StatCard[] = [
  { label: 'Daily Bookings', value: '42', delta: '+12%' },
  { label: 'Popular Service', value: 'Skin Fade', delta: '+8%' },
  { label: 'Revenue Today', value: '$1,340', delta: '+15%' },
  { label: 'Active Barbers', value: '7', delta: '+2' },
];

export const weekSlots = ['10:00', '11:00', '12:00', '14:00', '15:00', '17:00', '18:30'];
