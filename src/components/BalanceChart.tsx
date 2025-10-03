import React, { useMemo, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { formatChileanPeso } from '../utils/currencyUtils';
import { parseDateSafari, formatDateForChart, getDayOfMonth, isValidDate } from '../utils/dateUtils';

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
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  // Detectar cambios de tamaño de ventana para responsividad
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Función para determinar el color de la línea basado en el monto
  const getLineColor = useCallback((amount: number | undefined, upperAmount: number, lowerAmount: number) => {
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
  }, []);

  // Función para determinar el color del punto
  const getDotColor = useCallback((amount: number | undefined, upperAmount: number, lowerAmount: number) => {
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
  }, []);

  // Procesar datos para incluir colores dinámicos y manejar días sin datos - Memoizado para performance
  const processedData = useMemo(() => data.map(item => ({
    ...item,
    lineColor: getLineColor(item.amount, item.upper_amount, item.lower_amount),
    dotColor: getDotColor(item.amount, item.upper_amount, item.lower_amount),
    // Agregar datos para las líneas de referencia
    upperLine: item.upper_amount,
    lowerLine: item.lower_amount,
    // Marcar si hay datos o no
    hasData: item.amount !== undefined && item.amount !== null,
  })), [data, getLineColor, getDotColor]);

  // Función personalizada para el tooltip - Optimizado para mobile y Safari
  const CustomTooltip = useCallback(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      // Safari-safe date parsing
      const date = parseDateSafari(label);
      
      // Verificar si la fecha es válida
      if (!isValidDate(date)) {
        console.error('Invalid date in tooltip:', label);
        return null;
      }

      let formattedDate = '';
      try {
        formattedDate = date.toLocaleDateString('es-CL', { 
          weekday: isMobile ? 'short' : 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      } catch (e) {
        console.error('Error formatting date:', e);
        formattedDate = label; // Fallback al label original
      }
      
      // Safari-compatible styling sin backdrop-blur
      const tooltipStyle: React.CSSProperties = {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: isMobile ? '16px' : '20px',
        minWidth: isMobile ? '180px' : '220px',
        maxWidth: isMobile ? '90vw' : '320px',
        WebkitBackdropFilter: 'blur(10px)', // Safari support
        backdropFilter: 'blur(10px)',
      };
      
      return (
        <div style={tooltipStyle}>
          <p style={{
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '16px',
            textAlign: 'center',
            fontSize: isMobile ? '12px' : '14px',
            lineHeight: '1.4',
          }}>{formattedDate}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.hasData ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <div 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      marginRight: '8px',
                      backgroundColor: data.dotColor,
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <span style={{ 
                    fontSize: isMobile ? '10px' : '12px', 
                    fontWeight: 500, 
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>Balance del día</span>
                </div>
                <div style={{ 
                  fontSize: isMobile ? '20px' : '24px', 
                  fontWeight: 700, 
                  color: '#1e293b',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}>
                  {formatChileanPeso(data.amount)}
                </div>
                <div style={{
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: 600,
                  padding: isMobile ? '6px 12px' : '8px 12px',
                  borderRadius: '20px',
                  backgroundColor: data.amount >= data.upper_amount ? '#dcfce7' :
                    data.amount <= data.lower_amount ? '#fef3c7' : '#ede9fe',
                  color: data.amount >= data.upper_amount ? '#166534' :
                    data.amount <= data.lower_amount ? '#92400e' : '#5b21b6',
                  display: 'inline-block',
                }}>
                  {data.amount >= data.upper_amount ? 'Por encima del rango' :
                   data.amount <= data.lower_amount ? 'Por debajo del rango' :
                   'Dentro del rango seguro'}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#94a3b8', borderRadius: '50%', marginRight: '8px' }} />
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sin datos</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#94a3b8' }}>No hay información</div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  }, [isMobile]);

  // Función para formatear el eje Y - Optimizado para mobile
  const formatYAxis = useCallback((value: number) => {
    if (value === 0) {
      return ''; // No mostrar el valor 0
    }
    // En mobile, formato más compacto
    if (isMobile && value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (isMobile && value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return formatChileanPeso(value);
  }, [isMobile]);

  // Función para formatear el eje X (fechas) - Mobile-optimized y Safari-safe
  const formatXAxis = useCallback((value: string) => {
    // Safari-safe date parsing
    const date = parseDateSafari(value);
    
    // Verificar si la fecha es válida
    if (!isValidDate(date)) {
      console.error('Invalid date in X axis:', value);
      return 'N/A';
    }

    try {
      // En mobile, solo día
      if (isMobile) {
        return getDayOfMonth(date);
      }
      return formatDateForChart(date, 'short');
    } catch (e) {
      console.error('Error formatting X axis:', e);
      return 'N/A';
    }
  }, [isMobile]);

  // Calcular el rango del eje Y basado en los montos actuales - Memoizado
  const { yAxisMin, yAxisMax } = useMemo(() => {
    const allAmounts = processedData
      .filter(item => item.amount !== undefined && item.amount !== null)
      .map(item => item.amount as number);
    
    const minAmount = Math.min(...allAmounts, ...processedData.map(item => item.lower_amount));
    const maxAmount = Math.max(...allAmounts, ...processedData.map(item => item.upper_amount));
    
    // Rango del eje Y: 0.5x a 1.5x del monto actual
    return {
      yAxisMin: minAmount * 0.5,
      yAxisMax: maxAmount * 1.5,
    };
  }, [processedData]);

  // Configuración dinámica basada en tamaño de pantalla
  const chartMargins = useMemo(() => 
    isMobile 
      ? { top: 10, right: 10, left: 5, bottom: 10 }
      : { top: 20, right: 20, left: 20, bottom: 20 }
  , [isMobile]);

  const fontSize = isMobile ? 10 : 11;
  const dotRadius = isMobile ? 5 : 6;
  const lineWidth = isMobile ? 2 : 2.5;

  return (
    <div className="w-full" style={{ 
      WebkitTapHighlightColor: 'transparent', // Safari mobile tap highlight
      touchAction: 'pan-y', // Mejor scroll en mobile
    }}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart 
          data={processedData} 
          margin={chartMargins}
          // Mejorar performance en Safari
          isAnimationActive={!isMobile}
        >
          {/* Grid sutil */}
          <CartesianGrid 
            strokeDasharray="1 1" 
            stroke="#f1f5f9" 
            strokeOpacity={0.5}
            // Safari optimization
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Ejes minimalistas - Mobile optimized */}
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            stroke="transparent"
            fontSize={fontSize}
            tick={{ fill: '#64748b', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            // Menos ticks en mobile
            interval={isMobile ? 1 : 0}
            // Safari rendering fix
            style={{ userSelect: 'none' }}
          />
          <YAxis 
            tickFormatter={formatYAxis}
            stroke="transparent"
            fontSize={fontSize}
            tick={{ fill: '#64748b', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            domain={[yAxisMin, yAxisMax]}
            width={isMobile ? 45 : 60}
            // Safari rendering fix
            style={{ userSelect: 'none' }}
          />
          <Tooltip 
            content={<CustomTooltip />}
            // Optimización para touch devices
            cursor={{ stroke: '#858BF2', strokeWidth: 1, strokeDasharray: '5 5' }}
            // Safari iOS fix
            wrapperStyle={{ pointerEvents: 'auto' }}
            allowEscapeViewBox={{ x: false, y: true }}
          />
          
          {/* Área del rango seguro - Más visible y clara */}
          <Area
            type="monotone"
            dataKey="upper_amount"
            stackId="1"
            stroke="none"
            fill="url(#safeZoneGradient)"
            fillOpacity={0.3}
            // Safari performance
            isAnimationActive={!isMobile}
          />
          <Area
            type="monotone"
            dataKey="lower_amount"
            stackId="1"
            stroke="none"
            fill="#ffffff"
            fillOpacity={1}
            // Safari performance
            isAnimationActive={!isMobile}
          />
          
          {/* Líneas de referencia del rango seguro - Siempre visibles */}
          <ReferenceLine 
            y={processedData[0]?.upper_amount} 
            stroke="#10b981" 
            strokeDasharray="6 3" 
            strokeOpacity={0.7}
            strokeWidth={2}
            label={{ 
              value: isMobile ? `2.5x` : `Rango Superior (2.5x)`, 
              position: "insideTopRight",
              style: { 
                fontSize: isMobile ? 10 : 11, 
                fill: '#10b981', 
                fontWeight: 600,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 8px',
                borderRadius: '4px'
              }
            }}
          />
          <ReferenceLine 
            y={processedData[0]?.lower_amount} 
            stroke="#f59e0b" 
            strokeDasharray="6 3" 
            strokeOpacity={0.7}
            strokeWidth={2}
            label={{ 
              value: isMobile ? `1x` : `Rango Inferior (1x)`, 
              position: "insideBottomRight",
              style: { 
                fontSize: isMobile ? 10 : 11, 
                fill: '#f59e0b', 
                fontWeight: 600,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 8px',
                borderRadius: '4px'
              }
            }}
          />
          
          {/* Línea principal con estilo suave - Mobile optimized */}
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#858BF2"
            strokeWidth={lineWidth}
            connectNulls={true}
            // Safari rendering optimization
            isAnimationActive={!isMobile}
            animationDuration={isMobile ? 0 : 800}
            dot={({ cx, cy, payload, index }) => {
              if (!payload?.hasData) {
                return (
                  <circle
                    key={`dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={dotRadius - 2}
                    fill="#cbd5e1"
                    stroke="#ffffff"
                    strokeWidth={2}
                    opacity={0.6}
                    // Safari touch target
                    style={{ cursor: 'pointer' }}
                  />
                );
              }
              return (
                <circle
                  key={`dot-${index}`}
                  cx={cx}
                  cy={cy}
                  r={dotRadius}
                  fill={payload?.dotColor || '#3b82f6'}
                  stroke="#ffffff"
                  strokeWidth={isMobile ? 2 : 2.5}
                  // Safari compatible shadow
                  style={{ 
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    cursor: 'pointer',
                  }}
                />
              );
            }}
            activeDot={{ 
              r: isMobile ? 7 : 8, 
              fill: '#3b82f6', 
              stroke: '#ffffff', 
              strokeWidth: isMobile ? 2.5 : 3,
              style: {
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                cursor: 'pointer',
              }
            }}
          />
          
          {/* Definiciones de gradientes mejorados */}
          <defs>
            {/* Gradiente del rango seguro - Más visible */}
            <linearGradient id="safeZoneGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
      
      {/* Leyenda del rango seguro - Mobile friendly */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: isMobile ? '12px' : '16px',
        gap: isMobile ? '12px' : '20px',
        flexWrap: 'wrap',
        padding: isMobile ? '8px' : '12px',
        backgroundColor: 'rgba(248, 250, 252, 0.6)',
        borderRadius: '12px',
        fontSize: isMobile ? '11px' : '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0.2) 100%)',
            borderRadius: '3px',
            border: '1px solid #10b981',
          }} />
          <span style={{ color: '#64748b', fontWeight: 500 }}>
            Rango Seguro
          </span>
        </div>
        <div style={{ 
          color: '#94a3b8', 
          fontSize: isMobile ? '10px' : '11px',
          fontWeight: 400 
        }}>
          {isMobile ? '1x - 2.5x ingreso' : 'Entre 1x y 2.5x tu ingreso mensual'}
        </div>
      </div>
    </div>
  );
};

export default BalanceChart;
