export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAge = (age: number): boolean => {
  return age >= 16 && age <= 120;
};

export const validateBudget = (budget: number): boolean => {
  return budget > 0 && budget <= 10000;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 1) {
    errors.push('Password must be at least 1 character long');
  }
  
  return { isValid: errors.length === 0, errors };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const createValidator = <T>(
  validationFn: (value: T) => boolean,
  errorMessage: string
) => {
  return (value: T): { isValid: boolean; error?: string } => {
    const isValid = validationFn(value);
    return {
      isValid,
      error: isValid ? undefined : errorMessage
    };
  };
};
