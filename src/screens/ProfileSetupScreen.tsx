import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import db from '../database/db';

const ProfileSetupScreen = () => {
  const navigation = useNavigation();
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [age, setAge] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [userId, setUserId] = useState<number>(1);
  const [errors, setErrors] = useState({
    bio: '',
    interests: '',
    age: '',
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to upload a profile picture.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { bio: '', interests: '', age: '' };

    if (!bio.trim()) {
      newErrors.bio = 'Bio is required';
      isValid = false;
    }

    if (!interests.trim()) {
      newErrors.interests = 'Interests are required';
      isValid = false;
    }

    if (!age.trim()) {
      newErrors.age = 'Age is required';
      isValid = false;
    } else if (isNaN(Number(age)) || Number(age) < 18) {
      newErrors.age = 'Please enter a valid age (18+)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const success = await db.updateUser(userId, bio, interests, profilePicture);
      if (success) {
        navigation.navigate('Home' as never);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={theme.colors.gradients.surface}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Card variant="gradient" style={styles.card}>
              <View style={styles.imageContainer}>
                {profilePicture ? (
                  <Image source={{ uri: profilePicture }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderImage} />
                )}
                <Button
                  title="Upload Photo"
                  onPress={pickImage}
                  style={styles.uploadButton}
                />
              </View>

              <Input
                label="Bio"
                value={bio}
                onChangeText={setBio}
                multiline
                placeholder="Tell us about yourself..."
                error={errors.bio}
                style={styles.input}
              />

              <Input
                label="Interests"
                value={interests}
                onChangeText={setInterests}
                multiline
                placeholder="What are your hobbies and interests?"
                error={errors.interests}
                style={styles.input}
              />

              <Input
                label="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                maxLength={2}
                placeholder="Your age"
                error={errors.age}
                style={styles.input}
              />

              <Button
                title="Complete Profile"
                onPress={handleSubmit}
                gradient
                style={{ marginTop: 16 }}
              />
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  card: {
    marginVertical: theme.spacing.lg,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing.md,
    borderWidth: 3,
    borderColor: theme.colors.accent,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surfaceDark,
    marginBottom: theme.spacing.md,
  },
  uploadButton: {
    marginTop: theme.spacing.sm,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  submitButton: {
    marginTop: theme.spacing.xl,
  },
});

export default ProfileSetupScreen;
