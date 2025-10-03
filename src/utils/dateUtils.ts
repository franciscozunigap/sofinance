/**
 * Utilities para manejo de fechas compatible con Safari iOS
 * Safari no acepta bien formatos como "YYYY-MM-DD" con guiones
 */

/**
 * Parse una fecha de forma segura para Safari iOS
 * Convierte formatos como "YYYY-MM-DD" a formato ISO completo
 * @param dateString - String de fecha en cualquier formato
 * @returns Date object válido
 */
export function parseDateSafari(dateString: string | Date): Date {
  // Si ya es un Date object, retornarlo
  if (dateString instanceof Date) {
    return dateString;
  }

  // Si es string vacío o undefined, retornar fecha actual
  if (!dateString) {
    return new Date();
  }

  // Limpiar el string
  const cleanDateString = dateString.trim();

  // Si ya es formato ISO completo, usar directamente
  if (cleanDateString.includes('T') || cleanDateString.includes('Z')) {
    const date = new Date(cleanDateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Si es formato "YYYY-MM-DD" (problemático en Safari iOS)
  // Convertir a formato "YYYY/MM/DD" o parsear manualmente
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDateString)) {
    // Reemplazar guiones por slashes (Safari acepta esto)
    const safeDateString = cleanDateString.replace(/-/g, '/');
    const date = new Date(safeDateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Si es formato "YYYY-MM-DD HH:MM:SS"
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(cleanDateString)) {
    const safeDateString = cleanDateString.replace(/-/g, '/');
    const date = new Date(safeDateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Si es formato ISO con timezone "YYYY-MM-DDTHH:MM:SS"
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(cleanDateString)) {
    // Safari iOS necesita timezone explícito
    let isoString = cleanDateString;
    if (!isoString.endsWith('Z') && !isoString.includes('+') && !isoString.includes('GMT')) {
      isoString += 'Z'; // Asumir UTC si no tiene timezone
    }
    const date = new Date(isoString);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Intentar parseo manual para "YYYY-MM-DD"
  const parts = cleanDateString.split(/[-/]/);
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Meses en JS son 0-indexed
    const day = parseInt(parts[2], 10);
    
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  // Último intento: usar el constructor de Date directamente
  try {
    const date = new Date(cleanDateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (e) {
    console.error('Error parsing date:', cleanDateString, e);
  }

  // Si todo falla, retornar fecha actual
  console.warn('Failed to parse date, returning current date:', cleanDateString);
  return new Date();
}

/**
 * Verifica si una fecha es válida
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Formatea una fecha para el eje X del gráfico
 * Compatible con Safari iOS
 */
export function formatDateForChart(dateString: string | Date, format: 'short' | 'long' = 'short'): string {
  const date = parseDateSafari(dateString);
  
  if (!isValidDate(date)) {
    return 'N/A';
  }

  try {
    if (format === 'short') {
      return date.toLocaleDateString('es-CL', {
        month: 'short',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  } catch (e) {
    console.error('Error formatting date:', date, e);
    return 'N/A';
  }
}

/**
 * Convierte una fecha a string ISO safe para Safari
 */
export function toISOStringSafari(date: Date): string {
  if (!isValidDate(date)) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

/**
 * Obtiene solo el día de una fecha (1-31)
 */
export function getDayOfMonth(dateString: string | Date): string {
  const date = parseDateSafari(dateString);
  
  if (!isValidDate(date)) {
    return '1';
  }

  try {
    return date.toLocaleDateString('es-CL', { day: 'numeric' });
  } catch (e) {
    return date.getDate().toString();
  }
}

