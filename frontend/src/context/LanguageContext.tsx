import React, { createContext, useState, useContext, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isArabic: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'lang.select': 'Select Language',
    'lang.english': 'English',
    'lang.arabic': 'العربية',
    'welcome.title': 'All-in-One Barber Booking System',
    'welcome.subtitle': 'Simplify bookings and manage appointments easily.',
    'welcome.guest': 'Continue as Guest',
    'welcome.signup': 'Sign Up',
    'welcome.login': 'Log In',
    'home.hero.title': 'Modern Cuts. Smarter Booking.',
    'home.hero.subtitle': 'Book your perfect haircut in just a few taps',
    'home.services': 'Our Services',
    'home.barbers': 'Our Barbers',
    'home.book': 'Book Appointment',
    'service.haircut': 'Haircut',
    'service.beard': 'Beard Trim',
    'service.package': 'Hair + Beard Package',
    'service.fade': 'Skin Fade',
    'service.kids': 'Kids Haircut',
    'booking.step': 'Step',
    'booking.of': 'of',
    'booking.chooseService': 'Choose a Service',
    'booking.chooseBarber': 'Choose a Barber',
    'booking.chooseDate': 'Choose a Date',
    'booking.chooseTime': 'Choose a Time Slot',
    'booking.confirm': 'Confirm Your Booking',
    'dashboard.welcome': 'Welcome',
    'dashboard.upcoming': 'Upcoming',
    'dashboard.completed': 'Completed',
    'dashboard.total': 'Total Bookings',
    'dashboard.upcomingAppointments': 'Upcoming Appointments',
    'dashboard.bookingHistory': 'Booking History',
    'dashboard.noAppointments': 'No upcoming appointments',
    'admin.dashboard': 'Admin Dashboard',
    'admin.bookings': 'Bookings',
    'admin.barbers': 'Barbers',
    'admin.services': 'Services',
    'admin.totalBookings': 'Total Bookings',
    'admin.todayBookings': "Today's Bookings",
    'admin.activeBarbers': 'Active Barbers',
    'admin.allBookings': 'All Bookings',
    'admin.manageBarbers': 'Manage Barbers',
    'admin.manageServices': 'Manage Services',
    'auth.createAccount': 'Create your account',
    'auth.welcomeBack': 'Welcome back',
    'auth.fullName': 'Full Name',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signUp': 'Sign Up',
    'auth.login': 'Log In',
    'auth.orContinueWith': 'Or continue with',
    'auth.continueWithGoogle': 'Continue with Google',
    'auth.continueWithApple': 'Continue with Apple',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.backToWelcome': '← Back',
    'common.price': 'Price',
    'common.duration': 'Duration',
    'common.rating': 'Rating',
    'common.specialty': 'Specialty',
    'common.book': 'Book',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.next': 'Next',
    'common.back': 'Back',
    'common.logout': 'Logout',
    'common.reschedule': 'Reschedule',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.save': 'Save',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.phone': 'Phone',
    'common.name': 'Name',
  },
  ar: {
    'lang.select': 'اختر اللغة',
    'lang.english': 'English',
    'lang.arabic': 'العربية',
    'welcome.title': 'نظام حجز صالون الحلاقة الشامل',
    'welcome.subtitle': 'بسّط الحجوزات وأدِر المواعيد بسهولة.',
    'welcome.guest': 'متابعة كضيف',
    'welcome.signup': 'إنشاء حساب',
    'welcome.login': 'تسجيل الدخول',
    'home.hero.title': 'قصات حديثة. حجز أذكى.',
    'home.hero.subtitle': 'احجز قصة شعرك المثالية في بضع نقرات',
    'home.services': 'خدماتنا',
    'home.barbers': 'حلاقونا',
    'home.book': 'احجز موعداً',
    'service.haircut': 'قصة شعر',
    'service.beard': 'تشذيب اللحية',
    'service.package': 'قصة شعر + تشذيب لحية',
    'service.fade': 'تلاشي الجلد',
    'service.kids': 'قصة شعر للأطفال',
    'booking.step': 'الخطوة',
    'booking.of': 'من',
    'booking.chooseService': 'اختر الخدمة',
    'booking.chooseBarber': 'اختر الحلاق',
    'booking.chooseDate': 'اختر التاريخ',
    'booking.chooseTime': 'اختر وقت الموعد',
    'booking.confirm': 'تأكيد الحجز',
    'dashboard.welcome': 'أهلاً',
    'dashboard.upcoming': 'القادمة',
    'dashboard.completed': 'المكتملة',
    'dashboard.total': 'إجمالي الحجوزات',
    'dashboard.upcomingAppointments': 'المواعيد القادمة',
    'dashboard.bookingHistory': 'سجل الحجوزات',
    'dashboard.noAppointments': 'لا توجد مواعيد قادمة',
    'admin.dashboard': 'لوحة التحكم',
    'admin.bookings': 'الحجوزات',
    'admin.barbers': 'الحلاقون',
    'admin.services': 'الخدمات',
    'admin.totalBookings': 'إجمالي الحجوزات',
    'admin.todayBookings': 'حجوزات اليوم',
    'admin.activeBarbers': 'الحلاقون النشطون',
    'admin.allBookings': 'جميع الحجوزات',
    'admin.manageBarbers': 'إدارة الحلاقين',
    'admin.manageServices': 'إدارة الخدمات',
    'auth.createAccount': 'إنشاء حسابك',
    'auth.welcomeBack': 'أهلاً بعودتك',
    'auth.fullName': 'الاسم الكامل',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.signUp': 'إنشاء حساب',
    'auth.login': 'تسجيل الدخول',
    'auth.orContinueWith': 'أو تابع معنا',
    'auth.continueWithGoogle': 'تابع مع جوجل',
    'auth.continueWithApple': 'تابع مع أبل',
    'auth.alreadyHaveAccount': 'هل لديك حساب بالفعل؟',
    'auth.dontHaveAccount': 'ليس لديك حساب؟',
    'auth.backToWelcome': '← رجوع',
    'common.price': 'السعر',
    'common.duration': 'المدة',
    'common.rating': 'التقييم',
    'common.specialty': 'التخصص',
    'common.book': 'احجز',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.next': 'التالي',
    'common.back': 'رجوع',
    'common.logout': 'تسجيل الخروج',
    'common.reschedule': 'إعادة جدولة',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.save': 'حفظ',
    'common.close': 'إغلاق',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.phone': 'الهاتف',
    'common.name': 'الاسم',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isArabic: language === 'ar',
        isEnglish: language === 'en',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}