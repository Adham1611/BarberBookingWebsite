export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
  icon: string;
};

export type Barber = {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  image: string;
};

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export type Appointment = {
  id: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  price: number;
  status: AppointmentStatus;
};

export type StatCard = {
  label: string;
  value: string;
  delta: string;
};

export type Language = 'ar' | 'en';
