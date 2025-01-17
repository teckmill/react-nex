import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';

// Import screens (we'll create these next)
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import MatchScreen from './src/screens/MatchScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatScreen from './src/screens/ChatScreen';
import BadgesScreen from './src/screens/BadgesScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

// Database
import { initDatabase } from './src/database/db';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize:', error);
      }
    };

    init();
  }, []);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Splash"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#6200ee',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Splash" 
                component={SplashScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ title: 'AccountaDate' }}
              />
              <Stack.Screen 
                name="Register" 
                component={RegisterScreen}
                options={{ title: 'Create Account' }}
              />
              <Stack.Screen 
                name="ProfileSetup" 
                component={ProfileSetupScreen}
                options={{ title: 'Setup Profile' }}
              />
              <Stack.Screen 
                name="Match" 
                component={MatchScreen}
                options={{ title: 'Find Matches' }}
              />
              <Stack.Screen 
                name="ChatList" 
                component={ChatListScreen}
                options={{ title: 'Conversations' }}
              />
              <Stack.Screen 
                name="Chat" 
                component={ChatScreen}
                options={{ title: 'Chat' }}
              />
              <Stack.Screen 
                name="Badges" 
                component={BadgesScreen}
                options={{ title: 'Your Badges' }}
              />
              <Stack.Screen 
                name="TermsOfService" 
                component={TermsOfServiceScreen}
                options={{ title: 'Terms of Service' }}
              />
              <Stack.Screen 
                name="PrivacyPolicy" 
                component={PrivacyPolicyScreen}
                options={{ title: 'Privacy Policy' }}
              />
              <Stack.Screen 
                name="ForgotPassword" 
                component={ForgotPasswordScreen}
                options={{ title: 'Forgot Password' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
