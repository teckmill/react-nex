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

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

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
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const emailExists = await db.checkEmailExists(email);
      if (emailExists) {
        Alert.alert('Error', 'This email is already registered');
        return;
      }

      const success = await db.insertUser(username, email, password);
      if (success) {
        Alert.alert(
          'Success',
          'Account created successfully! Please log in.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login' as never),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#000428', '#004e92']}
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
              <Text style={styles.tagline}>Begin Your Journey</Text>
            </Animated.View>

            {/* Registration Form */}
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
                  label="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  error={errors.username}
                  style={styles.input}
                  icon="account-outline"
                />

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

                <Input
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  error={errors.confirmPassword}
                  style={styles.input}
                  icon="lock-check-outline"
                />

                <Button
                  title="Create Account"
                  onPress={handleRegister}
                  loading={isLoading}
                  gradient
                  style={styles.button}
                  textStyle={styles.buttonText}
                  disabled={isLoading}
                />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or sign up with</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtons}>
                  <TouchableOpacity style={styles.socialButton}>
                    <Text>
                      <MaterialCommunityIcons 
                        name="google" 
                        size={24} 
                        color={theme.colors.text.primary} 
                      />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <Text>
                      <MaterialCommunityIcons 
                        name="apple" 
                        size={24} 
                        color={theme.colors.text.primary} 
                      />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <Text>
                      <MaterialCommunityIcons 
                        name="facebook" 
                        size={24} 
                        color={theme.colors.text.primary} 
                      />
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={() => navigation.navigate('Login' as never)}
                >
                  <Text style={styles.loginText}>
                    Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
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
  button: {
    height: 56,
    borderRadius: 28,
    marginTop: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 16,
    fontSize: 14,
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
  loginButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
  },
  loginTextBold: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default RegisterScreen;
