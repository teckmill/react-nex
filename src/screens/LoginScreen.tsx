import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { theme } from '../styles/theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import db from '../database/db';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const blurAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    StatusBar.setBarStyle('light-content');

    // Sequence of animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 30,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(blurAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [navigation, fadeAnim, slideAnim, blurAnim, pulseAnim]);

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const user = await db.findUserByEmail(email, password);
      if (user) {
        navigation.navigate('Home' as never);
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const blurInterpolate = blurAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0px', '20px'],
  });

  return (
    <LinearGradient
      colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Animated Logo Section */}
            <Animated.View 
              style={[
                styles.logoContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    { scale: pulseAnim },
                    { translateY: slideAnim }
                  ],
                }
              ]}
            >
              <MaterialCommunityIcons 
                name="heart-multiple" 
                size={60} 
                color={theme.colors.accent}
              />
              <Text style={styles.appName}>AccountaDate</Text>
              <Text style={styles.tagline}>Elevate Your Dating Experience</Text>
            </Animated.View>

            {/* Login Form */}
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <BlurView
                intensity={100}
                tint="dark"
                style={styles.blurContainer}
              >
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  style={styles.input}
                  icon="email-outline"
                />

                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  error={errors.password}
                  style={styles.input}
                  icon="lock-outline"
                />

                <Button
                  title="Sign In"
                  onPress={handleLogin}
                  loading={isLoading}
                  gradient
                  style={styles.button}
                  textStyle={styles.buttonText}
                />

                <TouchableOpacity 
                  style={styles.googleButton}
                  onPress={signInWithGoogle}
                  activeOpacity={0.8}
                >
                  <View style={styles.googleButtonContent}>
                    <MaterialCommunityIcons 
                      name="google" 
                      size={20} 
                      color="#4285F4"
                      style={styles.googleIcon} 
                    />
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity 
                  style={styles.forgotPassword}
                  onPress={() => navigation.navigate('ForgotPassword' as never)}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <View style={styles.socialButtons}>
                  <TouchableOpacity style={styles.socialButton}>
                    <MaterialCommunityIcons 
                      name="apple" 
                      size={24} 
                      color={theme.colors.text.primary} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <MaterialCommunityIcons 
                      name="facebook" 
                      size={24} 
                      color={theme.colors.text.primary} 
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.registerButton}
                  onPress={() => navigation.navigate('Register' as never)}
                >
                  <Text style={styles.registerText}>
                    Don't have an account? <Text style={styles.registerTextBold}>Sign Up</Text>
                  </Text>
                </TouchableOpacity>
              </BlurView>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  blurContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  input: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  button: {
    height: 56,
    borderRadius: 28,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.surface,
  },
  dividerText: {
    marginHorizontal: 10,
    color: theme.colors.text.secondary,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  registerButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
  },
  registerTextBold: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default LoginScreen;
