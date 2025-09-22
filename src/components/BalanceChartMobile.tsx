import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal, TouchableOpacity, Animated } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { formatChileanPeso } from '../utils/currencyUtils';

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

const { width } = Dimensions.get('window');

const BalanceChartMobile: React.FC<BalanceChartMobileProps> = ({ data, height = 300 }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  // Función para determinar el color del punto basado en el monto - igual que web
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

  // Función para determinar el color de la línea basado en el monto - igual que web
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

  // Procesar datos para el gráfico con colores dinámicos - igual que web
  const processedData = data.map(item => ({
    ...item,
    lineColor: getLineColor(item.amount, item.upper_amount, item.lower_amount),
    dotColor: getDotColor(item.amount, item.upper_amount, item.lower_amount),
    hasData: item.amount !== undefined && item.amount !== null,
  }));

  const chartData = {
    labels: processedData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('es-CL', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets: [{
      data: processedData.map(item => (item.amount || 0) / 1000), // Convertir a miles para reducir zoom
      color: (opacity = 1) => `rgba(133, 139, 242, ${opacity})`, // Color base, se sobrescribe dinámicamente
      strokeWidth: 3
    }]
  };

  // Función para obtener el color del punto según el rango
  const getPointColor = (index: number) => {
    const pointData = processedData[index];
    if (!pointData || !pointData.hasData) {
      return '#6b7280'; // Gris para sin datos
    }
    return pointData.dotColor;
  };

  // Efecto de pulso para los puntos
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
  }, []);

  // Función para manejar el toque en un punto
  const handlePointPress = (index: number) => {
    const pointData = processedData[index];
    if (pointData && pointData.hasData) {
      setSelectedPoint(pointData);
      setShowTooltip(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={width - 80}
          height={height}
        chartConfig={{
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
          // Reducir zoom y hacer montos más pequeños
          formatYLabel: (value) => {
            const num = parseFloat(value);
            return `${num.toFixed(0)}K`;
          },
          yAxisSuffix: 'K'
        }}
          style={styles.chart}
          bezier
          withDots={false}
          withShadow={false}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={false}
          withHorizontalLines={true}
          fromZero={false}
          onDataPointClick={(data) => handlePointPress(data.index)}
        />
        
        {/* Puntos personalizados con colores dinámicos */}
        <View style={styles.customDotsContainer}>
          {processedData.map((item, index) => {
            if (!item.hasData) return null;
            
            // Calcular posición X (usando los mismos parámetros que react-native-chart-kit)
            const chartWidth = width - 80;
            const paddingLeft = 20;
            const paddingRight = 20;
            const availableWidth = chartWidth - paddingLeft - paddingRight;
            // Ajustar la fórmula para puntos más cercanos
            // Para 4 puntos, usar una distribución más compacta
            const totalPoints = processedData.length;
            const pointSpacing = availableWidth / (totalPoints - 1);
            const xPosition = paddingLeft + (index * pointSpacing);
            
            // Calcular posición Y usando los datos escalados (en miles)
            const allAmounts = processedData
              .filter(d => d.amount !== undefined && d.amount !== null)
              .map(d => (d.amount as number) / 1000); // Escalar a miles
            const minAmount = Math.min(...allAmounts);
            const maxAmount = Math.max(...allAmounts);
            const range = maxAmount - minAmount;
            
            // Usar los mismos márgenes que react-native-chart-kit
            const topMargin = 20;
            const bottomMargin = 40;
            const chartHeight = height - topMargin - bottomMargin;
            
            // Ajuste adicional para alineación con la línea
            const chartPadding = 20;
            
            // Calcular posición Y (invertida: mayor valor = más arriba)
            const scaledAmount = (item.amount! / 1000); // Escalar a miles
            const normalizedValue = range > 0 ? (scaledAmount - minAmount) / range : 0.5;
            const yPosition = topMargin + (1 - normalizedValue) * chartHeight;
            
            // Ajuste adicional para alineación con la línea del gráfico
            const yAdjustment = 2; // Ajuste fino para centrar en la línea
            
            // Ajuste fino para alineación perfecta con la línea
            // La línea del gráfico tiene un grosor, necesitamos centrar el punto
            const lineThickness = 3; // Grosor de la línea del gráfico
            const yOffset = lineThickness / 2; // Centrar en la línea
            const finalYPosition = yPosition - yOffset;
            
            // Ajuste de posición X para centrar en la línea
            const xOffset = 9; // Mitad del ancho del punto (18/2)
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.customDot,
                  {
                    left: xPosition - xOffset,
                    top: finalYPosition - xOffset,
                    backgroundColor: item.dotColor,
                    transform: [{ scale: pulseAnim }],
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.dotTouchable}
                  onPress={() => handlePointPress(index)}
                  activeOpacity={0.6}
                >
                  {/* Indicador de interactividad */}
                  <View style={styles.dotInner} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Tooltip Modal */}
      <Modal
        visible={showTooltip}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTooltip(false)}
      >
        <TouchableOpacity 
          style={styles.tooltipOverlay}
          activeOpacity={1}
          onPress={() => setShowTooltip(false)}
        >
          <View style={styles.tooltipContainer}>
            <View style={styles.tooltipContent}>
              <Text style={styles.tooltipTitle}>
                {selectedPoint ? new Date(selectedPoint.date).toLocaleDateString('es-CL', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : ''}
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
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
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
  // Tooltip styles
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    // Efecto glassmorphism
    backdropFilter: 'blur(20px)',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tooltipStatusText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default BalanceChartMobile;
