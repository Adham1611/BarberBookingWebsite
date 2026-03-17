import React, { createContext, useState, useContext, useEffect } from 'react';
import type { Language } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language | null;
    return saved || 'en';
  });

  const isRTL = language === 'ar';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Update document direction and lang attribute
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    // Set initial direction and lang
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Helper hook for translations
export const useTranslation = () => {
  const { language } = useLanguage();
  return (section: string, key: string): string => {
    const translations: Record<string, Record<string, Record<string, any>>> = {
      en: {
        language: {
          title: 'Choose Your Language',
          arabic: 'العربية',
          english: 'English',
        },
        welcome: {
          headline: 'Modern Cuts. Smarter Booking.',
          continueGuest: 'Continue as Guest',
          signUp: 'Sign Up',
          logIn: 'Log In',
        },
        auth: {
          googleButton: 'Continue with Google',
          appleButton: 'Continue with Apple',
          or: 'or',
          email: 'Email',
          password: 'Password',
          loginButton: 'Log In',
          signupButton: 'Sign Up',
          dontHaveAccount: "Don't have an account?",
          alreadyHaveAccount: 'Already have an account?',
        },
        home: {
          heroBanner: 'Modern Cuts. Smarter Booking.',
          heroSubtitle: 'Book your perfect appointment with top barbers',
          exploreServices: 'Explore Services',
          quickBook: 'Quick Book',
          services: 'Our Services',
          topBarbers: 'Top Barbers',
          bookNow: 'Book Now',
          selectBarber: 'Select a Barber',
          startBooking: 'Start Booking',
        },
        booking: {
          title: 'Book Your Appointment',
          step1: 'Choose Service',
          step2: 'Choose Barber',
          step3: 'Select Date',
          step4: 'Select Time',
          step5: 'Confirm Booking',
          selectService: 'Select a service',
          selectBarber: 'Select a barber',
          selectDate: 'Select a date',
          selectTime: 'Select a time slot',
          duration: 'Duration',
          rating: 'Rating',
          specialty: 'Specialty',
          availableSlots: 'Available Slots',
          reviewSummary: 'Booking Summary',
          service: 'Service',
          barber: 'Barber',
          date: 'Date',
          time: 'Time',
          price: 'Price',
          confirmButton: 'Confirm Booking',
          cancelButton: 'Cancel',
          bookingConfirmed: 'Booking Confirmed!',
          bookingConfirmedMessage: 'Your appointment has been booked successfully.',
        },
        nav: {
          crownCut: 'Crown Cut',
          home: 'Home',
          services: 'Services',
          barbers: 'Barbers',
          bookNow: 'Book Now',
          admin: 'Admin',
          language: 'Language',
        },
        bottomNav: {
          home: 'Home',
          book: 'Book',
          appointments: 'My App',
          admin: 'Admin',
        },
        dashboard: {
          myAppointments: 'My Appointments',
          upcomingAppointments: 'Upcoming Appointments',
          bookingHistory: 'Booking History',
          appointmentDate: 'Appointment Date',
          barber: 'Barber',
          service: 'Service',
          status: 'Status',
          reschedule: 'Reschedule',
          cancel: 'Cancel',
          upcoming: 'Upcoming',
          completed: 'Completed',
          cancelled: 'Cancelled',
          noAppointments: 'No appointments yet',
          stats: {
            upcoming: 'Upcoming',
            completed: 'Completed',
            loyaltyPoints: 'Loyalty Points',
          },
        },
        admin: {
          title: 'Admin Dashboard',
          overview: 'Overview',
          bookings: 'Bookings',
          services: 'Services',
          barbers: 'Barbers',
          analytics: 'Analytics',
          dailyBookings: 'Daily Bookings',
          popularService: 'Popular Service',
          revenue: 'Revenue',
          activeBarbers: 'Active Barbers',
          recentBookings: 'Recent Bookings',
          popularServices: 'Popular Services',
          customer: 'Customer',
          time: 'Time',
          viewAll: 'View All',
        },
        service: {
          duration: 'min',
          book: 'Book',
        },
        barber: {
          specialty: 'Specialty',
          rating: 'Rating',
          reviews: 'reviews',
          viewProfile: 'View Profile',
        },
        common: {
          save: 'Save',
          delete: 'Delete',
          edit: 'Edit',
          back: 'Back',
          next: 'Next',
          previous: 'Previous',
          close: 'Close',
          loading: 'Loading...',
          error: 'Error',
          success: 'Success',
          confirmDelete: 'Are you sure you want to delete?',
          yes: 'Yes',
          no: 'No',
        },
      },
      ar: {
        language: {
          title: 'اختر اللغة',
          arabic: 'العربية',
          english: 'English',
        },
        welcome: {
          headline: 'قصات عصرية. حجز أذكى.',
          continueGuest: 'المتابعة بدون حساب',
          signUp: 'إنشاء حساب',
          logIn: 'تسجيل الدخول',
        },
        auth: {
          googleButton: 'المتابعة مع Google',
          appleButton: 'المتابعة مع Apple',
          or: 'أو',
          email: 'البريد الإلكتروني',
          password: 'كلمة المرور',
          loginButton: 'تسجيل الدخول',
          signupButton: 'إنشاء حساب',
          dontHaveAccount: 'ليس لديك حساب؟',
          alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
        },
        home: {
          heroBanner: 'قصات عصرية. حجز أذكى.',
          heroSubtitle: 'احجز موعدك المثالي مع أفضل الحلاقين',
          exploreServices: 'استكشف الخدمات',
          quickBook: 'حجز سريع',
          services: 'خدماتنا',
          topBarbers: 'أفضل الحلاقين',
          bookNow: 'احجز الآن',
          selectBarber: 'اختر حلاق',
          startBooking: 'ابدأ الحجز',
        },
        booking: {
          title: 'احجز موعدك',
          step1: 'اختر الخدمة',
          step2: 'اختر الحلاق',
          step3: 'اختر التاريخ',
          step4: 'اختر الوقت',
          step5: 'تأكيد الحجز',
          selectService: 'اختر خدمة',
          selectBarber: 'اختر حلاقاً',
          selectDate: 'اختر تاريخاً',
          selectTime: 'اختر وقتاً',
          duration: 'المدة',
          rating: 'التقييم',
          specialty: 'التخصص',
          availableSlots: 'الأوقات المتاحة',
          reviewSummary: 'ملخص الحجز',
          service: 'الخدمة',
          barber: 'الحلاق',
          date: 'التاريخ',
          time: 'الوقت',
          price: 'السعر',
          confirmButton: 'تأكيد الحجز',
          cancelButton: 'إلغاء',
          bookingConfirmed: 'تم تأكيد الحجز!',
          bookingConfirmedMessage: 'تم حجز موعدك بنجاح.',
        },
        nav: {
          crownCut: 'Crown Cut',
          home: 'الرئيسية',
          services: 'الخدمات',
          barbers: 'الحلاقين',
          bookNow: 'احجز الآن',
          admin: 'لوحة التحكم',
          language: 'اللغة',
        },
        bottomNav: {
          home: 'الرئيسية',
          book: 'احجز',
          appointments: 'مواعيدي',
          admin: 'التحكم',
        },
        dashboard: {
          myAppointments: 'مواعيدي',
          upcomingAppointments: 'المواعيد القادمة',
          bookingHistory: 'سجل الحجوزات',
          appointmentDate: 'تاريخ الموعد',
          barber: 'الحلاق',
          service: 'الخدمة',
          status: 'الحالة',
          reschedule: 'إعادة جدولة',
          cancel: 'إلغاء',
          upcoming: 'قادم',
          completed: 'مكتمل',
          cancelled: 'ملغى',
          noAppointments: 'لا توجد مواعيد حتى الآن',
          stats: {
            upcoming: 'قادم',
            completed: 'مكتمل',
            loyaltyPoints: 'نقاط الولاء',
          },
        },
        admin: {
          title: 'لوحة التحكم',
          overview: 'نظرة عامة',
          bookings: 'الحجوزات',
          services: 'الخدمات',
          barbers: 'الحلاقين',
          analytics: 'الإحصائيات',
          dailyBookings: 'الحجوزات اليومية',
          popularService: 'الخدمة الشهيرة',
          revenue: 'الإيرادات',
          activeBarbers: 'الحلاقين النشطين',
          recentBookings: 'آخر الحجوزات',
          popularServices: 'الخدمات الشهيرة',
          customer: 'العميل',
          time: 'الوقت',
          viewAll: 'عرض الكل',
        },
        service: {
          duration: 'دق',
          book: 'احجز',
        },
        barber: {
          specialty: 'التخصص',
          rating: 'التقييم',
          reviews: 'تقييمات',
          viewProfile: 'عرض الملف الشخصي',
        },
        common: {
          save: 'حفظ',
          delete: 'حذف',
          edit: 'تعديل',
          back: 'رجوع',
          next: 'التالي',
          previous: 'السابق',
          close: 'إغلاق',
          loading: 'جاري التحميل...',
          error: 'خطأ',
          success: 'نجح',
          confirmDelete: 'هل تريد فعلاً حذف؟',
          yes: 'نعم',
          no: 'لا',
        },
      },
    };

    try {
      const langObj = translations[language];
      const sectionObj = langObj[section];
      if (sectionObj && typeof sectionObj === 'object') {
        const value = sectionObj[key];
        return typeof value === 'string' ? value : key;
      }
      return key;
    } catch {
      return key;
    }
  };
};
