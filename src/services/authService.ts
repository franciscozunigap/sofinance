import { LoginCredentials, User } from '../types';

// Simulación de servicio de autenticación
export class AuthService {
  private static currentUser: User | null = null;

  static async login(credentials: LoginCredentials): Promise<User> {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validación básica (en una app real, esto sería una llamada a la API)
    if (credentials.email && credentials.password) {
      const user: User = {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
      };
      
      this.currentUser = user;
      return user;
    }
    
    throw new Error('Credenciales inválidas');
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
