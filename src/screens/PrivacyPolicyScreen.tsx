import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.content}>AccountaDate Privacy Policy
Last Updated: [Date]
Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use the AccountaDate app.

1. Information We Collect
We collect the following types of information:

Personal Information: When you register, we collect personal details like your email address, phone number, and other account information.
Usage Data: We collect information about how you use the App, such as your device type, operating system, IP address, and actions taken in the App.
2. How We Use Your Information
We use your information for the following purposes:

To provide and maintain the App’s services.
To communicate with you regarding your account, transactions, and any updates to the App.
To improve the functionality and user experience of the App.
To send you marketing communications (only if you opt-in).
3. Sharing Your Information
We do not share your personal information with third parties, except in the following circumstances:

To comply with legal obligations.
To protect our rights and the safety of users.
With service providers assisting with App operations (such as cloud hosting).
4. Data Security
We employ reasonable measures to protect your personal data from unauthorized access, alteration, or disclosure. However, no method of data transmission over the internet is 100% secure, and we cannot guarantee absolute security.

5. Your Rights
You have the right to:

Access, correct, or delete your personal information.
Opt out of marketing communications at any time.
Withdraw your consent to data processing where applicable.
To exercise these rights, please contact us at [Your Contact Information].

6. Third-Party Services
The App may contain links to third-party websites or services. We are not responsible for the privacy practices of these third-party websites.

7. Cookies and Tracking
We may use cookies or similar technologies to improve your experience in the App. You can disable cookies through your device settings.

8. Children’s Privacy
The App is not intended for children under 18. We do not knowingly collect personal information from children. If we learn that we have inadvertently collected personal information from a child, we will delete it as soon as possible.

9. Changes to Privacy Policy
We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the "Last Updated" date will be revised.

10. Contact Us
If you have any questions or concerns about this Privacy Policy, please contact us at [Your Contact Information].</Text>
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

export default PrivacyPolicyScreen;
