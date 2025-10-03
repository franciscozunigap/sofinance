import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal, TouchableOpacity, Animated, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { formatChileanPeso } from '../utils/currencyUtils';
import { parseDateSafari, formatDateForChart, isValidDate } from '../utils/dateUtils';

interface BalanceData {
  date: string;
  amount?: number; // Opcional para manejar días sin datos
  upper_amount: number;
  lower_amount: number;
}

interface BalanceChartMobileProps {
  data: BalanceData[];
  height?: number;
}

const BalanceChartMobile: React.FC<BalanceChartMobileProps> = ({ data, height = 300 }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  // Detectar cambios de orientación para responsividad
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // Función para determinar el color del punto basado en el monto - Memoizado
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

  // Función para determinar el color de la línea basado en el monto - Memoizado
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

  // Procesar datos para el gráfico con colores dinámicos - Memoizado para performance
  const processedData = useMemo(() => data.map(item => ({
    ...item,
    lineColor: getLineColor(item.amount, item.upper_amount, item.lower_amount),
    dotColor: getDotColor(item.amount, item.upper_amount, item.lower_amount),
    hasData: item.amount !== undefined && item.amount !== null,
  })), [data, getLineColor, getDotColor]);

  // Calcular dimensiones del gráfico de forma dinámica y responsiva
  const chartWidth = useMemo(() => {
    const isLandscape = dimensions.width > dimensions.height;
    const basePadding = isLandscape ? 120 : 80;
    return Math.max(dimensions.width - basePadding, 250); // Mínimo 250px
  }, [dimensions]);

  const chartData = useMemo(() => ({
    labels: processedData.map(item => {
      // Safari-safe date parsing
      const date = parseDateSafari(item.date);
      
      // Verificar si la fecha es válida
      if (!isValidDate(date)) {
        console.error('Invalid date in chart data:', item.date);
        return 'N/A';
      }

      try {
        return formatDateForChart(date, 'short');
      } catch (e) {
        console.error('Error formatting chart label:', e);
        return 'N/A';
      }
    }),
    datasets: [{
      data: processedData.map(item => (item.amount || 0) / 1000), // Convertir a miles para reducir zoom
      color: (opacity = 1) => `rgba(133, 139, 242, ${opacity})`, // Color base, se sobrescribe dinámicamente
      strokeWidth: 3
    }]
  }), [processedData]);

  // Tamaño de fuente dinámico basado en el tamaño de pantalla
  const fontSize = useMemo(() => {
    const isSmallDevice = dimensions.width < 375;
    return isSmallDevice ? 10 : 12;
  }, [dimensions.width]);

  // Función para obtener el color del punto según el rango
  const getPointColor = useCallback((index: number) => {
    const pointData = processedData[index];
    if (!pointData || !pointData.hasData) {
      return '#6b7280'; // Gris para sin datos
    }
    return pointData.dotColor;
  }, [processedData]);

  // Efecto de pulso para los puntos - Optimizado para performance
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Función para manejar el toque en un punto - Optimizado
  const handlePointPress = useCallback((index: number) => {
    const pointData = processedData[index];
    if (pointData && pointData.hasData) {
      setSelectedPoint(pointData);
      setShowTooltip(true);
    }
  }, [processedData]);

  // Función para calcular posición Y de las líneas de rango
  const calculateYPosition = useCallback((amount: number | undefined) => {
    if (!amount || processedData.length === 0) return 0;
    
    const allAmounts = processedData
      .filter(d => d.amount !== undefined && d.amount !== null)
      .map(d => (d.amount as number) / 1000);
    
    if (allAmounts.length === 0) return 0;
    
    const minAmount = Math.min(...allAmounts);
    const maxAmount = Math.max(...allAmounts);
    const range = maxAmount - minAmount || 1;
    
    const topMargin = 20;
    const bottomMargin = 40;
    const effectiveChartHeight = height - topMargin - bottomMargin;
    
    const scaledAmount = amount / 1000;
    const normalizedValue = (scaledAmount - minAmount) / range;
    const yPosition = topMargin + (1 - normalizedValue) * effectiveChartHeight;
    
    return yPosition;
  }, [processedData, height]);

  // Configuración del gráfico optimizada para diferentes dispositivos
  const chartConfig = useMemo(() => ({
    backgroundColor: '#f0f2ff',
    backgroundGradientFrom: '#f0f2ff',
    backgroundGradientTo: '#f0f2ff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(133, 139, 242, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "0", // Ocultar puntos nativos
      strokeWidth: "0",
      stroke: 'transparent',
      fill: 'transparent'
    },
    propsForBackgroundLines: {
      strokeDasharray: "1 1",
      stroke: '#f1f5f9',
      strokeOpacity: 0.5
    },
    formatYLabel: (value: string) => {
      const num = parseFloat(value);
      return `${num.toFixed(0)}K`;
    },
    yAxisSuffix: 'K'
  }), []);

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={height}
          chartConfig={chartConfig}
          style={[styles.chart, Platform.OS === 'ios' && styles.chartIOS]}
          bezier
          withDots={false}
          withShadow={false}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={false}
          withHorizontalLines={true}
          fromZero={false}
          onDataPointClick={(data) => handlePointPress(data.index)}
          // Optimizaciones para Safari y Chrome mobile
          segments={4}
        />
        
        {/* Puntos personalizados con colores dinámicos - Responsive */}
        <View style={styles.customDotsContainer} pointerEvents="box-none">
          {processedData.map((item, index) => {
            if (!item.hasData) return null;
            
            // Calcular posición X de forma dinámica (usando los mismos parámetros que react-native-chart-kit)
            const paddingLeft = 20;
            const paddingRight = 20;
            const availableWidth = chartWidth - paddingLeft - paddingRight;
            // Ajustar la fórmula para puntos más cercanos
            // Para 4 puntos, usar una distribución más compacta
            const totalPoints = Math.max(processedData.length, 2); // Evitar división por cero
            const pointSpacing = totalPoints > 1 ? availableWidth / (totalPoints - 1) : availableWidth / 2;
            const xPosition = paddingLeft + (index * pointSpacing);
            
            // Calcular posición Y usando los datos escalados (en miles) - Memoizado implícitamente
            const allAmounts = processedData
              .filter(d => d.amount !== undefined && d.amount !== null)
              .map(d => (d.amount as number) / 1000); // Escalar a miles
            
            if (allAmounts.length === 0) return null; // Sin datos válidos
            
            const minAmount = Math.min(...allAmounts);
            const maxAmount = Math.max(...allAmounts);
            const range = maxAmount - minAmount || 1; // Evitar división por cero
            
            // Márgenes y dimensiones del gráfico
            const topMargin = 20;
            const bottomMargin = 40;
            const effectiveChartHeight = height - topMargin - bottomMargin;
            
            // Calcular posición Y (invertida: mayor valor = más arriba)
            const scaledAmount = (item.amount! / 1000); // Escalar a miles
            const normalizedValue = (scaledAmount - minAmount) / range;
            const yPosition = topMargin + (1 - normalizedValue) * effectiveChartHeight;
            
            // Ajustes finos para alineación perfecta
            const lineThickness = 3; // Grosor de la línea del gráfico
            const yOffset = lineThickness / 2; // Centrar en la línea
            const finalYPosition = yPosition - yOffset;
            
            // Tamaño dinámico del punto basado en el dispositivo
            const dotSize = dimensions.width < 375 ? 16 : 18;
            const xOffset = dotSize / 2; // Mitad del ancho del punto
            
            return (
              <Animated.View
                key={`dot-${index}`}
                style={[
                  styles.customDot,
                  {
                    left: xPosition - xOffset,
                    top: finalYPosition - xOffset,
                    backgroundColor: item.dotColor,
                    transform: [{ scale: pulseAnim }],
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2,
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.dotTouchable}
                  onPress={() => handlePointPress(index)}
                  activeOpacity={0.6}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Área de toque más grande
                  accessibilityLabel={`Punto de datos ${index + 1}`}
                  accessibilityRole="button"
                >
                  {/* Indicador de interactividad */}
                  <View style={styles.dotInner} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Indicadores visuales del rango seguro */}
        <View style={styles.rangeIndicators} pointerEvents="none">
          {/* Línea de rango superior */}
          <View 
            style={[
              styles.rangeLine,
              styles.rangeLineUpper,
              {
                top: calculateYPosition(processedData[0]?.upper_amount),
              }
            ]}
          >
            <View style={[styles.rangeLabel, styles.rangeLabelUpper]}>
              <Text style={styles.rangeLabelText}>2.5x</Text>
            </View>
          </View>

          {/* Línea de rango inferior */}
          <View 
            style={[
              styles.rangeLine,
              styles.rangeLineLower,
              {
                top: calculateYPosition(processedData[0]?.lower_amount),
              }
            ]}
          >
            <View style={[styles.rangeLabel, styles.rangeLabelLower]}>
              <Text style={styles.rangeLabelText}>1x</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Leyenda del rango seguro */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.legendColorBox} />
          <Text style={styles.legendText}>Rango Seguro</Text>
        </View>
        <Text style={styles.legendSubtext}>
          Entre 1x y 2.5x tu ingreso mensual
        </Text>
      </View>

      {/* Tooltip Modal - Optimizado para mobile */}
      <Modal
        visible={showTooltip}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTooltip(false)}
        statusBarTranslucent={true}
        hardwareAccelerated={true} // Mejor performance en Android
      >
        <TouchableOpacity 
          style={styles.tooltipOverlay}
          activeOpacity={1}
          onPress={() => setShowTooltip(false)}
          accessibilityLabel="Cerrar información del punto"
          accessibilityRole="button"
        >
          <View style={[
            styles.tooltipContainer,
            dimensions.width < 375 && styles.tooltipContainerSmall
          ]}>
            <View style={styles.tooltipContent}>
              <Text style={[styles.tooltipTitle, { fontSize }]}>
                {selectedPoint ? (() => {
                  // Safari-safe date parsing
                  const date = parseDateSafari(selectedPoint.date);
                  
                  if (!isValidDate(date)) {
                    return 'Fecha inválida';
                  }

                  try {
                    return date.toLocaleDateString('es-CL', { 
                      weekday: dimensions.width < 375 ? 'short' : 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    });
                  } catch (e) {
                    console.error('Error formatting tooltip date:', e);
                    return selectedPoint.date;
                  }
                })() : ''}
              </Text>
              <View style={styles.tooltipBody}>
                <View style={styles.tooltipPoint}>
                  <View 
                    style={[
                      styles.tooltipDot, 
                      { backgroundColor: selectedPoint?.dotColor || '#858BF2' }
                    ]} 
                  />
                  <Text style={styles.tooltipLabel}>Balance del día</Text>
                </View>
                <Text style={styles.tooltipAmount}>
                  {selectedPoint ? formatChileanPeso(selectedPoint.amount) : ''}
                </Text>
                <View style={[
                  styles.tooltipStatus,
                  { 
                    backgroundColor: selectedPoint?.amount >= selectedPoint?.upper_amount ? '#dcfce7' :
                                   selectedPoint?.amount <= selectedPoint?.lower_amount ? '#fef3c7' :
                                   '#e0e7ff'
                  }
                ]}>
                  <Text style={[
                    styles.tooltipStatusText,
                    { 
                      color: selectedPoint?.amount >= selectedPoint?.upper_amount ? '#166534' :
                             selectedPoint?.amount <= selectedPoint?.lower_amount ? '#92400e' :
                             '#3730a3'
                    }
                  ]}>
                    {selectedPoint?.amount >= selectedPoint?.upper_amount ? 'Por encima del rango superior' :
                     selectedPoint?.amount <= selectedPoint?.lower_amount ? 'Por debajo del rango inferior' :
                     'Dentro del rango seguro'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  // Optimizaciones específicas para iOS Safari
  chartIOS: {
    overflow: 'hidden', // Prevenir bleeding de SVG en Safari
  },
  chartWrapper: {
    position: 'relative',
  },
  customDotsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  customDot: {
    position: 'absolute',
    // width y height se establecen dinámicamente
    borderWidth: 3,
    borderColor: '#ffffff',
    // Sombras optimizadas para performance
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
    }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  // Tooltip styles - Optimizado para diferentes tamaños de pantalla
  tooltipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tooltipContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 24,
    minWidth: 240,
    maxWidth: 280,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 15,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 15,
      },
    }),
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  tooltipContainerSmall: {
    padding: 16,
    minWidth: 200,
    maxWidth: 260,
  },
  tooltipContent: {
    alignItems: 'center',
  },
  tooltipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  tooltipBody: {
    alignItems: 'center',
  },
  tooltipPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tooltipDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tooltipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tooltipAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  tooltipStatus: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  tooltipStatusText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Range Indicators - Indicadores visuales del rango
  rangeIndicators: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  rangeLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  rangeLineUpper: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    borderTopWidth: 2,
    borderTopColor: '#10b981',
    borderStyle: 'dashed',
  },
  rangeLineLower: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    borderTopWidth: 2,
    borderTopColor: '#f59e0b',
    borderStyle: 'dashed',
  },
  rangeLabel: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  rangeLabelUpper: {
    backgroundColor: 'rgba(220, 252, 231, 0.95)',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  rangeLabelLower: {
    backgroundColor: 'rgba(254, 243, 199, 0.95)',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  rangeLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1f2937',
  },
  // Legend - Leyenda del rango
  legend: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: 12,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColorBox: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    borderColor: '#10b981',
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  legendSubtext: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default BalanceChartMobile;
