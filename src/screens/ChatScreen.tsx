import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';
import db from '../database/db';

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { matchId, matchName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef();

  useEffect(() => {
    navigation.setOptions({
      title: matchName,
      headerRight: () => (
        <TouchableOpacity 
          style={styles.endButton} 
          onPress={showEndChatConfirmation}
        >
          <Text style={styles.endButtonText}>End Chat</Text>
        </TouchableOpacity>
      ),
    });

    loadMessages();
    const interval = setInterval(loadMessages, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT m.*, u.username 
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.match_id = ?
        ORDER BY m.timestamp DESC`,
        [matchId],
        (_, { rows: { _array } }) => {
          setMessages(_array.reverse());
        }
      );
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO messages (match_id, sender_id, message) VALUES (?, (SELECT MAX(id) FROM users), ?)',
        [matchId, newMessage.trim()],
        (_, result) => {
          setNewMessage('');
          loadMessages();
        }
      );
    });
  };

  const showEndChatConfirmation = () => {
    Alert.alert(
      'End Chat',
      'Please provide a reason for ending this chat:',
      [
        {
          text: 'Found Someone Else',
          onPress: () => endChat('Found Someone Else'),
        },
        {
          text: 'Not Compatible',
          onPress: () => endChat('Not Compatible'),
        },
        {
          text: 'Other',
          onPress: () => endChat('Other'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const endChat = (reason) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE matches SET status = ?, reason = ? WHERE id = ?',
        ['ended', reason, matchId],
        (_, result) => {
          navigation.goBack();
        }
      );
    });
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender_id === messages[0]?.sender_id;

    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  messagesList: {
    padding: theme.spacing.md,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
  },
  messageText: {
    ...theme.typography.body,
    color: theme.colors.background,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.background + '80',
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.disabled + '20',
    backgroundColor: theme.colors.surface,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    maxHeight: 100,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  sendButtonText: {
    ...theme.typography.body,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  endButton: {
    marginRight: theme.spacing.md,
  },
  endButtonText: {
    color: theme.colors.error,
    ...theme.typography.body,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
