import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Animated,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'gradient';
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'elevated',
  elevation = 'md',
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scale, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const getElevation = () => {
    if (elevation === 'none') return {};
    return theme.shadows[elevation];
  };

  const renderContent = () => {
    if (variant === 'gradient') {
      return (
        <LinearGradient
          colors={theme.colors.gradients.surface}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, style]}
        >
          {children}
        </LinearGradient>
      );
    }

    return (
      <View
        style={[
          styles.card,
          variant === 'outlined' && styles.outlined,
          variant === 'elevated' && getElevation(),
          style,
        ]}
      >
        {children}
      </View>
    );
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          {renderContent()}
        </Animated.View>
      </Pressable>
    );
  }

  return renderContent();
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.surfaceDark,
  },
  gradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
});
