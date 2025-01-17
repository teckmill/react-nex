import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TermsOfServiceScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms of Service</Text>
      <Text style={styles.content}>AccountaDate Terms of Service (TOS)
Last Updated: [Date]
By accessing or using the AccountaDate app (the "App"), you agree to comply with and be bound by the following Terms of Service. If you do not agree to these terms, do not use the App.

1. Acceptance of Terms
By using the App, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of the terms, you must not use the App.

2. Use of the App
AccountaDate is an app designed to connect users with temporary, generated phone numbers for dating purposes. You agree to use the App only for lawful purposes and in accordance with these Terms. You must be at least 18 years old to use the App.

3. Account Registration
To access the features of the App, you must create an account by providing your email address, phone number, and other relevant details. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.

4. User Responsibilities
You agree to:

Use the App responsibly and with respect to other users.
Provide accurate and complete information when registering.
Not share your generated phone number with malicious intent or for spam.
Not engage in harassment, hate speech, or illegal activities through the App.
5. Prohibited Activities
You agree not to:

Violate any laws or regulations.
Impersonate another user or entity.
Use the App for any fraudulent, malicious, or harmful activity.
Send unsolicited or spam messages to others.
Use the App to cause harm or inconvenience to others.
6. Termination
We reserve the right to suspend or terminate your account at any time for any reason, including violation of these Terms of Service. You may also request the deletion of your account through the app.

7. Disclaimer of Warranties
The App is provided "as is" without warranties of any kind, either express or implied. We do not guarantee the App will be error-free or uninterrupted.

8. Limitation of Liability
We are not liable for any indirect, incidental, or consequential damages arising from your use of the App, including but not limited to data loss or service interruptions.

9. Changes to Terms
We reserve the right to update or modify these Terms of Service at any time. Any changes will be posted on this page, and the "Last Updated" date will be revised.

10. Governing Law
These Terms of Service shall be governed by and construed in accordance with the laws of [Your Country/State].</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TermsOfServiceScreen;
