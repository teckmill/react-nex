import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  Animated,
  View,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  disabled = false,
  loading = false,
  style,
  textStyle,
  gradient = false,
  variant = 'primary',
}) => {
  const buttonScale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </>
  );

  const containerStyle = [
    styles.container,
    disabled && styles.disabled,
    style,
    { transform: [{ scale: buttonScale }] },
  ];

  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    outline: styles.outline,
  };

  if (gradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[containerStyle, variantStyles[variant]]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#4776E6', '#8E54E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={containerStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[styles.button, variantStyles[variant], disabled && styles.disabled]}
        activeOpacity={0.8}
      >
        {buttonContent}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
  },
  button: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 28,
  },
  primary: {
    backgroundColor: '#4776E6',
    borderColor: '#4776E6',
  },
  secondary: {
    backgroundColor: '#8E54E9',
    borderColor: '#8E54E9',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#FFFFFF',
  },
  gradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
