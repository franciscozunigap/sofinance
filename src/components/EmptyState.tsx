import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants';
import Button from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📊',
  title,
  description,
  actionLabel,
  onAction,
  illustration,
}) => {
  return (
    <View style={styles.container}>
      {illustration ? (
        <Image source={illustration} style={styles.illustration} resizeMode="contain" />
      ) : (
        <Text style={styles.icon}>{icon}</Text>
      )}
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: SIZES.xl,
  },
  icon: {
    fontSize: 80,
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  description: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SIZES.xl,
  },
  button: {
    minWidth: 200,
  },
});

export default EmptyState;

