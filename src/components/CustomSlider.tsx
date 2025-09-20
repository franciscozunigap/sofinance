import React from 'react';
import { Slider } from '@react-native-community/slider';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CustomSliderProps {
  style?: ViewStyle;
  minimumValue: number;
  maximumValue: number;
  value: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  step?: number;
  disabled?: boolean;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  style,
  minimumValue,
  maximumValue,
  value,
  onValueChange,
  minimumTrackTintColor = '#858BF2',
  maximumTrackTintColor = '#E5E7EB',
  thumbTintColor = '#858BF2',
  step = 1,
  disabled = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbTintColor={thumbTintColor}
        step={step}
        disabled={disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default CustomSlider;
