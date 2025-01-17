import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MaterialCommunityIcons as IconType } from '@expo/vector-icons';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  maxLength?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  icon?: keyof typeof IconType.glyphMap;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  multiline,
  style,
  inputStyle,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'none',
  icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = React.useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnimation = React.useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.parallel([
      Animated.timing(labelPosition, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!value) {
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    Animated.timing(borderAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const animatedLabelStyle = {
    transform: [
      {
        translateY: labelPosition.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -25],
        }),
      },
      {
        scale: labelPosition.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.85],
        }),
      },
    ] as Animated.WithAnimatedObject<TextStyle>['transform'],
  };

  const borderStyle = {
    borderColor: borderAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.8)'],
    }),
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.inputContainer, borderStyle]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color="rgba(255, 255, 255, 0.6)"
            style={styles.icon}
          />
        )}
        <View style={styles.inputWrapper}>
          <Animated.Text style={[styles.label, animatedLabelStyle]}>
            {label}
          </Animated.Text>
          <TextInput
            style={[styles.input, inputStyle]}
            placeholder={placeholder}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            maxLength={maxLength}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
          />
        </View>
      </Animated.View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    position: 'absolute',
    left: 0,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 8,
    paddingRight: 8,
  },
  error: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});
