import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
    ]).start(() => {
      navigation.navigate('Login' as never);
    });
  }, [fadeAnim, navigation]);

  return (
    <LinearGradient
      colors={theme.colors.gradients.primary}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>AccountaDate</Text>
        <Text style={styles.subtitle}>Where Respectful Dating Starts</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes['5xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.sizes['xl'],
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.inverse,
    textAlign: 'center',
  },
});

export default SplashScreen;
