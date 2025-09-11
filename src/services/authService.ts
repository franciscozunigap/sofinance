import { LoginCredentials, User } from '../types';

// Simulación de servicio de autenticación
export class AuthService {
  private static currentUser: User | null = null;

  static async login(credentials: LoginCredentials): Promise<User> {
    console.log('AuthService.login llamado con:', credentials);
    
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Credenciales de prueba
    const testCredentials = [
      { email: 'test@sofinance.com', password: '123456' },
      { email: 'demo@sofinance.com', password: 'demo123' },
      { email: 'admin@sofinance.com', password: 'admin123' }
    ];
    
    // Validación básica (en una app real, esto sería una llamada a la API)
    if (credentials.email && credentials.password && credentials.email.trim() !== '' && credentials.password.trim() !== '') {
      // Verificar si son credenciales de prueba
      const isValidTest = testCredentials.some(
        test => test.email === credentials.email && test.password === credentials.password
      );
      
      if (isValidTest || credentials.password.length >= 6) {
        const user: User = {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
        };
        
        this.currentUser = user;
        console.log('Usuario creado:', user);
        return user;
      }
    }
    
    console.log('Credenciales inválidas:', { email: credentials.email, password: credentials.password });
    throw new Error('Credenciales inválidas. Usa: test@sofinance.com / 123456');
  }

  static async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentUser = null;
  }

  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  static isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}
