/**
 * Formatea un número como moneda chilena
 * @param amount - El monto a formatear
 * @param showSymbol - Si mostrar el símbolo de peso ($)
 * @returns String formateado como moneda chilena
 */
export const formatChileanPeso = (amount: number, showSymbol: boolean = true): string => {
  const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formatted = formatter.format(amount);
  
  // Si no queremos el símbolo, lo removemos
  if (!showSymbol) {
    return formatted.replace('$', '').trim();
  }
  
  return formatted;
};

/**
 * Formatea un número como moneda chilena sin símbolo
 * @param amount - El monto a formatear
 * @returns String formateado sin símbolo de peso
 */
export const formatChileanPesoWithoutSymbol = (amount: number): string => {
  return formatChileanPeso(amount, false);
};

/**
 * Parsea un string de moneda chilena a número
 * @param currencyString - String con formato de moneda
 * @returns Número parseado
 */
export const parseChileanPeso = (currencyString: string): number => {
  // Remover todos los caracteres no numéricos excepto el punto decimal
  const cleanString = currencyString.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
};

