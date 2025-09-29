// Test que simula el flujo completo del usuario
import { BalanceService } from '../../services/balanceService';
import { BalanceRecord, BalanceCategory } from '../../types';

describe('User Flow - Income Registration', () => {
  it('should simulate complete user flow for income registration', () => {
    // Paso 1: Usuario tiene balance actual de 100000
    const currentBalance = 100000;
    
    // Paso 2: Usuario ingresa nuevo balance de 150000
    const newBalance = 150000;
    const difference = newBalance - currentBalance; // +50000
    
    console.log('Current Balance:', currentBalance);
    console.log('New Balance:', newBalance);
    console.log('Difference:', difference);
    
    // Paso 3: Sistema crea registro inteligente (debería ser income)
    const smartRecord = BalanceService.createSmartEmptyRecord(difference);
    console.log('Smart Record Created:', smartRecord);
    
    expect(smartRecord.type).toBe('income');
    expect(smartRecord.category).toBe('Ingreso');
    
    // Paso 4: Usuario ingresa monto de 50000
    const userRecord: BalanceRecord = {
      ...smartRecord,
      amount: 50000,
    };
    
    console.log('User Record:', userRecord);
    
    // Paso 5: Verificar cálculos
    const records = [userRecord];
    const netTotal = BalanceService.calculateTotal(records);
    const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
    
    console.log('Net Total:', netTotal);
    console.log('Absolute Total:', absoluteTotal);
    
    // Verificaciones
    expect(userRecord.type).toBe('income');
    expect(userRecord.category).toBe('Ingreso');
    expect(userRecord.amount).toBe(50000);
    
    expect(netTotal).toBe(50000); // Debe ser positivo
    expect(absoluteTotal).toBe(50000); // Debe ser positivo
    
    // Paso 6: Validar que la diferencia sea correcta
    const validation = BalanceService.validateRecords(records, difference);
    console.log('Validation:', validation);
    
    expect(validation.isValid).toBe(true);
    expect(validation.error).toBeUndefined();
  });

  it('should handle the exact scenario described by user', () => {
    // Escenario: Usuario ingresa balance mayor por 50000 al anterior
    // Balance anterior: 100000
    // Nuevo balance: 150000
    // Diferencia: +50000
    // Registro: Ingreso de 50000
    
    const currentBalance = 100000;
    const newBalance = 150000;
    const difference = newBalance - currentBalance; // +50000
    
    // Crear registro de ingreso
    const incomeRecord: BalanceRecord = {
      id: 'test-id',
      amount: 50000,
      type: 'income',
      category: 'Ingreso',
      description: 'Test income',
    };
    
    const records = [incomeRecord];
    
    // Calcular totales
    const netTotal = BalanceService.calculateTotal(records);
    const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
    
    console.log('=== USER SCENARIO DEBUG ===');
    console.log('Current Balance:', currentBalance);
    console.log('New Balance:', newBalance);
    console.log('Difference:', difference);
    console.log('Record:', incomeRecord);
    console.log('Net Total (should be +50000):', netTotal);
    console.log('Absolute Total (should be +50000):', absoluteTotal);
    console.log('===========================');
    
    // Verificaciones críticas
    expect(netTotal).toBe(50000); // Debe ser POSITIVO
    expect(absoluteTotal).toBe(50000); // Debe ser POSITIVO
    expect(netTotal).toBe(absoluteTotal); // Deben ser iguales para un ingreso
    
    // Validar que la diferencia sea correcta
    const validation = BalanceService.validateRecords(records, difference);
    expect(validation.isValid).toBe(true);
    expect(validation.error).toBeUndefined();
  });
});
