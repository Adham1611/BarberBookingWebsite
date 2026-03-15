import React, { createContext, useState, useContext } from 'react';

export interface Booking {
  id: string;
  serviceId: string;
  barberId: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  customerName: string;
  customerPhone: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  getBookingById: (id: string) => Booking | undefined;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (booking: Booking) => {
    setBookings([...bookings, booking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(bookings.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const cancelBooking = (id: string) => {
    updateBooking(id, { status: 'cancelled' });
  };

  const getBookingById = (id: string) => {
    return bookings.find(b => b.id === id);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBooking,
        cancelBooking,
        getBookingById,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}