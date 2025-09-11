import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
} from 'react-native';

interface CustomSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  style?: any;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  minimumTrackTintColor = '#007AFF',
  maximumTrackTintColor = '#E5E5E7',
  thumbTintColor = '#007AFF',
  style,
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const thumbSize = 20;

  const updateValue = (newValue: number) => {
    const clampedValue = Math.max(minimumValue, Math.min(maximumValue, newValue));
    const steppedValue = Math.round(clampedValue / step) * step;
    onValueChange(steppedValue);
  };

  const getThumbPosition = () => {
    if (sliderWidth === 0) return 0;
    const percentage = (value - minimumValue) / (maximumValue - minimumValue);
    return percentage * (sliderWidth - thumbSize);
  };

  const getTrackWidth = () => {
    if (sliderWidth === 0) return 0;
    const percentage = (value - minimumValue) / (maximumValue - minimumValue);
    return percentage * sliderWidth;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setIsDragging(true);
      
      // Calcular posición inicial basada en el touch
      if (sliderWidth > 0) {
        const touchX = evt.nativeEvent.locationX;
        const percentage = Math.max(0, Math.min(1, touchX / sliderWidth));
        const newValue = minimumValue + percentage * (maximumValue - minimumValue);
        updateValue(newValue);
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (sliderWidth === 0) return;
      
      // Calcular la nueva posición basada en el movimiento relativo
      const touchX = evt.nativeEvent.locationX;
      const percentage = Math.max(0, Math.min(1, touchX / sliderWidth));
      const newValue = minimumValue + percentage * (maximumValue - minimumValue);
      updateValue(newValue);
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
    },
  });

  return (
    <View 
      style={[styles.container, style]}
    >
      <View
        style={styles.track}
        onLayout={(event) => {
          setSliderWidth(event.nativeEvent.layout.width);
        }}
      >
        <View
          style={[
            styles.minimumTrack,
            { 
              backgroundColor: minimumTrackTintColor,
              width: getTrackWidth(),
            },
          ]}
        />
        <View
          style={[
            styles.thumb,
            { 
              backgroundColor: thumbTintColor,
              left: getThumbPosition(),
              opacity: isDragging ? 0.8 : 1,
            },
          ]}
        />
      </View>
      {/* Área táctil invisible más grande para facilitar el uso */}
      <View
        style={styles.touchArea}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
    position: 'relative',
  },
  track: {
    height: 4,
    backgroundColor: '#E5E5E7',
    borderRadius: 2,
    position: 'relative',
  },
  minimumTrack: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: -8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  touchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    // backgroundColor: 'rgba(255,0,0,0.1)', // Descomenta para debug
  },
});

export default CustomSlider;
