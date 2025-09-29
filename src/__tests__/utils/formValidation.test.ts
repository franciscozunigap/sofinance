import { 
  validateLoginForm, 
  validateRegistrationForm,
  validateAge,
  validateIncome,
  validateSavings 
} from '../../utils/validation';

describe('Form Validation', () => {
  describe('validateLoginForm', () => {
    it('should validate correct login data', () => {
      const errors = validateLoginForm('test@example.com', 'password123');
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should reject empty email', () => {
      const errors = validateLoginForm('', 'password123');
      expect(errors.email).toBe('El email es requerido');
    });

    it('should reject invalid email', () => {
      const errors = validateLoginForm('invalid-email', 'password123');
      expect(errors.email).toBe('El email no es válido');
    });

    it('should reject empty password', () => {
      const errors = validateLoginForm('test@example.com', '');
      expect(errors.password).toBe('La contraseña es requerida');
    });

    it('should reject short password', () => {
      const errors = validateLoginForm('test@example.com', '12345');
      expect(errors.password).toBe('La contraseña debe tener al menos 6 caracteres');
    });

    it('should handle multiple errors', () => {
      const errors = validateLoginForm('', '');
      expect(errors.email).toBe('El email es requerido');
      expect(errors.password).toBe('La contraseña es requerida');
    });
  });

  describe('validateRegistrationForm', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Juan',
      lastName: 'Pérez',
      age: 25,
      monthlyIncome: 500000,
      currentSavings: 100000
    };

    it('should validate correct registration data', () => {
      const errors = validateRegistrationForm(validData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should reject invalid email', () => {
      const errors = validateRegistrationForm({
        ...validData,
        email: 'invalid-email'
      });
      expect(errors.email).toBe('El email no es válido');
    });

    it('should reject short password', () => {
      const errors = validateRegistrationForm({
        ...validData,
        password: '12345'
      });
      expect(errors.password).toBe('La contraseña debe tener al menos 6 caracteres');
    });

    it('should reject empty firstName', () => {
      const errors = validateRegistrationForm({
        ...validData,
        firstName: ''
      });
      expect(errors.firstName).toBe('El nombre es requerido');
    });

    it('should reject empty lastName', () => {
      const errors = validateRegistrationForm({
        ...validData,
        lastName: ''
      });
      expect(errors.lastName).toBe('El apellido es requerido');
    });

    it('should reject invalid age', () => {
      const errors = validateRegistrationForm({
        ...validData,
        age: 15
      });
      expect(errors.age).toBe('La edad debe estar entre 18 y 120 años');
    });

    it('should reject negative income', () => {
      const errors = validateRegistrationForm({
        ...validData,
        monthlyIncome: -1000
      });
      expect(errors.monthlyIncome).toBe('El ingreso mensual debe ser mayor a 0');
    });

    it('should reject negative savings', () => {
      const errors = validateRegistrationForm({
        ...validData,
        currentSavings: -1000
      });
      expect(errors.currentSavings).toBe('Los disponibles actuales no pueden ser negativos');
    });
  });

  describe('validateAge', () => {
    it('should validate correct ages', () => {
      expect(validateAge(18)).toBe(true);
      expect(validateAge(25)).toBe(true);
      expect(validateAge(65)).toBe(true);
      expect(validateAge(120)).toBe(true);
    });

    it('should reject ages below 18', () => {
      expect(validateAge(17)).toBe(false);
      expect(validateAge(0)).toBe(false);
      expect(validateAge(-5)).toBe(false);
    });

    it('should reject ages above 120', () => {
      expect(validateAge(121)).toBe(false);
      expect(validateAge(150)).toBe(false);
    });
  });

  describe('validateIncome', () => {
    it('should validate correct income', () => {
      expect(validateIncome(1000)).toBe(true);
      expect(validateIncome(500000)).toBe(true);
      expect(validateIncome(1000000)).toBe(true);
    });

    it('should reject zero or negative income', () => {
      expect(validateIncome(0)).toBe(false);
      expect(validateIncome(-1000)).toBe(false);
    });

    it('should reject income above limit', () => {
      expect(validateIncome(1000001)).toBe(false);
      expect(validateIncome(2000000)).toBe(false);
    });
  });

  describe('validateSavings', () => {
    it('should validate correct savings', () => {
      expect(validateSavings(0)).toBe(true);
      expect(validateSavings(100000)).toBe(true);
      expect(validateSavings(10000000)).toBe(true);
    });

    it('should reject negative savings', () => {
      expect(validateSavings(-1000)).toBe(false);
      expect(validateSavings(-50000)).toBe(false);
    });

    it('should reject savings above limit', () => {
      expect(validateSavings(10000001)).toBe(false);
      expect(validateSavings(20000000)).toBe(false);
    });
  });
});
