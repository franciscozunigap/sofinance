// Utilidades de validación compartidas

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateAge = (age: number): boolean => {
  return age >= 18 && age <= 120;
};

export const validateIncome = (income: number): boolean => {
  return income > 0 && income <= 1000000;
};

export const validateSavings = (savings: number): boolean => {
  return savings >= 0 && savings <= 10000000;
};

// Validación de formularios
export interface ValidationErrors {
  [key: string]: string;
}

export const validateLoginForm = (email: string, password: string): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!validateRequired(email)) {
    errors.email = 'El email es requerido';
  } else if (!validateEmail(email)) {
    errors.email = 'El email no es válido';
  }

  if (!validateRequired(password)) {
    errors.password = 'La contraseña es requerida';
  } else if (!validatePassword(password)) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  return errors;
};

export const validateRegistrationForm = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  monthlyIncome: number;
  currentSavings: number;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!validateRequired(data.email)) {
    errors.email = 'El email es requerido';
  } else if (!validateEmail(data.email)) {
    errors.email = 'El email no es válido';
  }

  if (!validateRequired(data.password)) {
    errors.password = 'La contraseña es requerida';
  } else if (!validatePassword(data.password)) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  if (!validateRequired(data.firstName)) {
    errors.firstName = 'El nombre es requerido';
  }

  if (!validateRequired(data.lastName)) {
    errors.lastName = 'El apellido es requerido';
  }

  if (!validateAge(data.age)) {
    errors.age = 'La edad debe estar entre 18 y 120 años';
  }

  if (!validateIncome(data.monthlyIncome)) {
    errors.monthlyIncome = 'El ingreso mensual debe ser mayor a 0';
  }

  if (!validateSavings(data.currentSavings)) {
    errors.currentSavings = 'Los ahorros actuales no pueden ser negativos';
  }

  return errors;
};
