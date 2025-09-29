/**
 * Manejador centralizado de errores para la aplicación
 */
export class ErrorHandler {
  private static errorLog: Array<{
    timestamp: Date;
    error: Error;
    context: string;
    userId?: string;
  }> = [];

  /**
   * Tipos de errores conocidos
   */
  static readonly ERROR_TYPES = {
    NETWORK: 'NETWORK_ERROR',
    FIREBASE: 'FIREBASE_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    AUTH: 'AUTH_ERROR',
    PERMISSION: 'PERMISSION_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR',
  } as const;

  /**
   * Maneja un error y lo registra
   */
  static handleError(
    error: Error | unknown,
    context: string,
    userId?: string
  ): {
    type: string;
    message: string;
    userMessage: string;
    shouldRetry: boolean;
  } {
    const errorInfo = this.analyzeError(error);
    
    // Registrar error
    this.logError(error instanceof Error ? error : new Error(String(error)), context, userId);
    
    return {
      type: errorInfo.type,
      message: errorInfo.message,
      userMessage: errorInfo.userMessage,
      shouldRetry: errorInfo.shouldRetry,
    };
  }

  /**
   * Analiza un error y determina su tipo y mensaje
   */
  private static analyzeError(error: Error | unknown): {
    type: string;
    message: string;
    userMessage: string;
    shouldRetry: boolean;
  } {
    if (!(error instanceof Error)) {
      return {
        type: this.ERROR_TYPES.UNKNOWN,
        message: 'Error desconocido',
        userMessage: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
        shouldRetry: true,
      };
    }

    const errorMessage = error.message.toLowerCase();

    // Errores de Firebase
    if (errorMessage.includes('firebase') || errorMessage.includes('firestore')) {
      return this.handleFirebaseError(error);
    }

    // Errores de red
    if (errorMessage.includes('network') || errorMessage.includes('timeout') || errorMessage.includes('fetch')) {
      return {
        type: this.ERROR_TYPES.NETWORK,
        message: error.message,
        userMessage: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
        shouldRetry: true,
      };
    }

    // Errores de autenticación
    if (errorMessage.includes('auth') || errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
      return {
        type: this.ERROR_TYPES.AUTH,
        message: error.message,
        userMessage: 'Error de autenticación. Por favor, inicia sesión nuevamente.',
        shouldRetry: false,
      };
    }

    // Errores de validación
    if (errorMessage.includes('validation') || errorMessage.includes('invalid') || errorMessage.includes('required')) {
      return {
        type: this.ERROR_TYPES.VALIDATION,
        message: error.message,
        userMessage: error.message,
        shouldRetry: false,
      };
    }

    // Error desconocido
    return {
      type: this.ERROR_TYPES.UNKNOWN,
      message: error.message,
      userMessage: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
      shouldRetry: true,
    };
  }

  /**
   * Maneja errores específicos de Firebase
   */
  private static handleFirebaseError(error: Error): {
    type: string;
    message: string;
    userMessage: string;
    shouldRetry: boolean;
  } {
    const errorMessage = error.message.toLowerCase();

    // Errores de permisos
    if (errorMessage.includes('permission-denied')) {
      return {
        type: this.ERROR_TYPES.PERMISSION,
        message: error.message,
        userMessage: 'No tienes permisos para realizar esta acción.',
        shouldRetry: false,
      };
    }

    // Errores de documento no encontrado
    if (errorMessage.includes('not-found') || errorMessage.includes('document not found')) {
      return {
        type: this.ERROR_TYPES.FIREBASE,
        message: error.message,
        userMessage: 'No se encontró la información solicitada.',
        shouldRetry: false,
      };
    }

    // Errores de cuota excedida
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      return {
        type: this.ERROR_TYPES.FIREBASE,
        message: error.message,
        userMessage: 'Se ha excedido el límite de operaciones. Intenta más tarde.',
        shouldRetry: true,
      };
    }

    // Errores de conexión de Firebase
    if (errorMessage.includes('unavailable') || errorMessage.includes('deadline')) {
      return {
        type: this.ERROR_TYPES.FIREBASE,
        message: error.message,
        userMessage: 'Servicio temporalmente no disponible. Intenta en unos minutos.',
        shouldRetry: true,
      };
    }

    // Otros errores de Firebase
    return {
      type: this.ERROR_TYPES.FIREBASE,
      message: error.message,
      userMessage: 'Error del servidor. Por favor, intenta nuevamente.',
      shouldRetry: true,
    };
  }

  /**
   * Registra un error en el log
   */
  private static logError(error: Error, context: string, userId?: string): void {
    const errorEntry = {
      timestamp: new Date(),
      error,
      context,
      userId,
    };

    this.errorLog.push(errorEntry);

    // Mantener solo los últimos 100 errores
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Log en consola en desarrollo
    if (__DEV__) {
      console.error(`[${context}] Error:`, error);
    }
  }

  /**
   * Obtiene el log de errores
   */
  static getErrorLog(): Array<{
    timestamp: Date;
    error: Error;
    context: string;
    userId?: string;
  }> {
    return [...this.errorLog];
  }

  /**
   * Limpia el log de errores
   */
  static clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Obtiene errores por tipo
   */
  static getErrorsByType(type: string): Array<{
    timestamp: Date;
    error: Error;
    context: string;
    userId?: string;
  }> {
    return this.errorLog.filter(entry => 
      this.analyzeError(entry.error).type === type
    );
  }

  /**
   * Obtiene errores por usuario
   */
  static getErrorsByUser(userId: string): Array<{
    timestamp: Date;
    error: Error;
    context: string;
    userId?: string;
  }> {
    return this.errorLog.filter(entry => entry.userId === userId);
  }

  /**
   * Valida si un error es recuperable
   */
  static isRecoverableError(error: Error | unknown): boolean {
    const errorInfo = this.analyzeError(error);
    return errorInfo.shouldRetry;
  }

  /**
   * Obtiene estadísticas de errores
   */
  static getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    byContext: Record<string, number>;
    recent: number; // Errores en la última hora
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const byType: Record<string, number> = {};
    const byContext: Record<string, number> = {};
    let recent = 0;

    this.errorLog.forEach(entry => {
      const errorInfo = this.analyzeError(entry.error);
      
      // Contar por tipo
      byType[errorInfo.type] = (byType[errorInfo.type] || 0) + 1;
      
      // Contar por contexto
      byContext[entry.context] = (byContext[entry.context] || 0) + 1;
      
      // Contar recientes
      if (entry.timestamp > oneHourAgo) {
        recent++;
      }
    });

    return {
      total: this.errorLog.length,
      byType,
      byContext,
      recent,
    };
  }
}

/**
 * Hook para manejo de errores en componentes
 */
export const useErrorHandler = () => {
  const handleError = (error: Error | unknown, context: string, userId?: string) => {
    return ErrorHandler.handleError(error, context, userId);
  };

  const isRecoverable = (error: Error | unknown) => {
    return ErrorHandler.isRecoverableError(error);
  };

  const getErrorStats = () => {
    return ErrorHandler.getErrorStats();
  };

  return {
    handleError,
    isRecoverable,
    getErrorStats,
  };
};
