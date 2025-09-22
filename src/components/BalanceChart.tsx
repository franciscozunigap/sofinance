import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { formatChileanPeso } from '../utils/currencyUtils';

interface BalanceData {
  date: string;
  amount?: number; // Opcional para manejar días sin datos
  upper_amount: number;
  lower_amount: number;
}

interface BalanceChartProps {
  data: BalanceData[];
  height?: number;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ data, height = 300 }) => {
  // Función para determinar el color de la línea basado en el monto
  const getLineColor = (amount: number | undefined, upperAmount: number, lowerAmount: number) => {
    if (amount === undefined || amount === null) {
      return '#9ca3af'; // Gris - sin datos
    }
    if (amount >= upperAmount) {
      return '#10b981'; // Verde - por encima o igual del rango superior
    } else if (amount <= lowerAmount) {
      return '#f39c12'; // Amarillo - por debajo o igual del rango inferior
    } else {
      return '#858BF2'; // Color principal de la app - dentro del rango seguro
    }
  };

  // Función para determinar el color del punto
  const getDotColor = (amount: number | undefined, upperAmount: number, lowerAmount: number) => {
    if (amount === undefined || amount === null) {
      return '#6b7280'; // Gris - sin datos
    }
    if (amount >= upperAmount) {
      return '#059669'; // Verde más oscuro - por encima o igual del rango superior
    } else if (amount <= lowerAmount) {
      return '#d97706'; // Amarillo más oscuro - por debajo o igual del rango inferior
    } else {
      return '#6366f1'; // Color principal más oscuro - dentro del rango seguro
    }
  };

  // Procesar datos para incluir colores dinámicos y manejar días sin datos
  const processedData = data.map(item => ({
    ...item,
    lineColor: getLineColor(item.amount, item.upper_amount, item.lower_amount),
    dotColor: getDotColor(item.amount, item.upper_amount, item.lower_amount),
    // Agregar datos para las líneas de referencia
    upperLine: item.upper_amount,
    lowerLine: item.lower_amount,
    // Marcar si hay datos o no
    hasData: item.amount !== undefined && item.amount !== null,
  }));

  // Función personalizada para el tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = new Date(label);
      const formattedDate = date.toLocaleDateString('es-CL', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      return (
        <div className="bg-white/95 backdrop-blur-sm p-5 border border-slate-200/50 rounded-2xl shadow-xl min-w-[220px]">
          <p className="font-semibold text-slate-800 mb-4 text-center text-sm">{formattedDate}</p>
          <div className="space-y-3">
            {data.hasData ? (
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 shadow-sm" 
                    style={{ backgroundColor: data.dotColor }}
                  ></div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Balance del día</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-2">
                  {formatChileanPeso(data.amount)}
                </div>
                <div className={`text-xs font-medium px-3 py-1 rounded-full ${
                  data.amount >= data.upper_amount ? 'text-green-700 bg-green-50' :
                  data.amount <= data.lower_amount ? 'text-yellow-700 bg-yellow-50' :
                  'text-purple-700 bg-purple-50'
                }`}>
                  {data.amount >= data.upper_amount ? 'Por encima o igual del rango superior' :
                   data.amount <= data.lower_amount ? 'Por debajo o igual del rango inferior' :
                   'Dentro del rango seguro'}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-3 h-3 bg-slate-400 rounded-full mr-2"></div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sin datos registrados</span>
                </div>
                <div className="text-lg font-medium text-slate-400">No hay información disponible</div>
              </div>
            )}
            
            <div className="border-t border-slate-100 pt-3 mt-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium">Rango superior:</span>
                <span className="font-semibold text-slate-700">{formatChileanPeso(data.upper_amount)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium">Rango inferior:</span>
                <span className="font-semibold text-slate-700">{formatChileanPeso(data.lower_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Función para formatear el eje Y
  const formatYAxis = (value: number) => {
    if (value === 0) {
      return ''; // No mostrar el valor 0
    }
    return formatChileanPeso(value);
  };

  // Función para formatear el eje X (fechas)
  const formatXAxis = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('es-CL', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calcular el rango del eje Y basado en los montos actuales
  const allAmounts = processedData
    .filter(item => item.amount !== undefined && item.amount !== null)
    .map(item => item.amount as number);
  
  const minAmount = Math.min(...allAmounts, ...processedData.map(item => item.lower_amount));
  const maxAmount = Math.max(...allAmounts, ...processedData.map(item => item.upper_amount));
  
  // Rango del eje Y: 0.5x a 1.5x del monto actual
  const yAxisMin = minAmount * 0.5;
  const yAxisMax = maxAmount * 1.5;

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={processedData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          {/* Grid sutil */}
          <CartesianGrid strokeDasharray="1 1" stroke="#f1f5f9" strokeOpacity={0.5} />
          
          {/* Ejes minimalistas */}
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            stroke="transparent"
            fontSize={11}
            tick={{ fill: '#64748b', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={formatYAxis}
            stroke="transparent"
            fontSize={11}
            tick={{ fill: '#64748b', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            domain={[yAxisMin, yAxisMax]}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Área de la zona saludable con gradiente suave */}
          <Area
            type="monotone"
            dataKey="upper_amount"
            stackId="1"
            stroke="none"
            fill="url(#healthyZoneGradient)"
            fillOpacity={0.15}
          />
          <Area
            type="monotone"
            dataKey="lower_amount"
            stackId="1"
            stroke="none"
            fill="#ffffff"
            fillOpacity={1}
          />
          
          {/* Líneas de referencia sutiles */}
          <ReferenceLine 
            y={processedData[0]?.upper_amount} 
            stroke="#10b981" 
            strokeDasharray="8 4" 
            strokeOpacity={0.4}
            strokeWidth={1.5}
            label={{ 
              value: "Rango Superior", 
              position: "top",
              style: { fontSize: '10px', fill: '#10b981', fontWeight: 500 }
            }}
          />
          <ReferenceLine 
            y={processedData[0]?.lower_amount} 
            stroke="#f59e0b" 
            strokeDasharray="8 4" 
            strokeOpacity={0.4}
            strokeWidth={1.5}
            label={{ 
              value: "Rango Inferior", 
              position: "bottom",
              style: { fontSize: '10px', fill: '#f59e0b', fontWeight: 500 }
            }}
          />
          
          {/* Línea principal con estilo suave */}
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#858BF2"
            strokeWidth={2.5}
            connectNulls={true}
            dot={({ cx, cy, payload }) => {
              if (!payload?.hasData) {
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#cbd5e1"
                    stroke="#ffffff"
                    strokeWidth={2}
                    opacity={0.6}
                  />
                );
              }
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill={payload?.dotColor || '#3b82f6'}
                  stroke="#ffffff"
                  strokeWidth={2.5}
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                />
              );
            }}
            activeDot={{ 
              r: 8, 
              fill: '#3b82f6', 
              stroke: '#ffffff', 
              strokeWidth: 3,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
            }}
          />
          
          {/* Definiciones de gradientes */}
          <defs>
            <linearGradient id="healthyZoneGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;
