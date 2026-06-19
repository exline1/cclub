export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{9,15}$/;

export function validateRequired(
  value: string,
  fieldName: string
): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, message: `${fieldName} maydoni to'ldirilishi shart` };
  }
  return { isValid: true };
}

export function validateEmailOrPhone(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, message: "Email yoki telefon raqamini kiriting" };
  }

  const isEmail = EMAIL_REGEX.test(trimmed);
  const isPhone = PHONE_REGEX.test(trimmed.replace(/[\s()-]/g, ""));

  if (!isEmail && !isPhone) {
    return {
      isValid: false,
      message: "To'g'ri email yoki telefon raqamini kiriting",
    };
  }

  return { isValid: true };
}

export function validateEmail(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, message: "Email maydoni to'ldirilishi shart" };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, message: "To'g'ri email formatini kiriting" };
  }
  return { isValid: true };
}

export function validatePassword(value: string): ValidationResult {
  if (!value) {
    return { isValid: false, message: "Parol maydoni to'ldirilishi shart" };
  }
  if (value.length < 6) {
    return {
      isValid: false,
      message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
    };
  }
  return { isValid: true };
}

export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (password !== confirmPassword) {
    return { isValid: false, message: "Parollar mos kelmadi" };
  }
  return { isValid: true };
}

export function validateTermsAccepted(accepted: boolean): ValidationResult {
  if (!accepted) {
    return {
      isValid: false,
      message: "Davom etish uchun shartlarga rozilik bildiring",
    };
  }
  return { isValid: true };
}
