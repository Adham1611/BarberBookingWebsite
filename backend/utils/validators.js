export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePassword = (password) => password.length >= 6;
export const validatePhone = (phone) => phone && phone.length >= 10;