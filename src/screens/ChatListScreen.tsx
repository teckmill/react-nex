import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { theme } from '../styles/theme';
import db from '../database/db';

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [matches, setMatches] = useState([]);

  const loadMatches = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT m.*, u.username, u.profile_picture, 
        (SELECT message FROM messages 
         WHERE match_id = m.id 
         ORDER BY timestamp DESC 
         LIMIT 1) as last_message,
        (SELECT timestamp FROM messages 
         WHERE match_id = m.id 
         ORDER BY timestamp DESC 
         LIMIT 1) as last_message_time
        FROM matches m
        JOIN users u ON m.match_id = u.id
        WHERE m.user_id = (SELECT MAX(id) FROM users)
        AND m.status = 'active'
        ORDER BY last_message_time DESC`,
        [],
        (_, { rows: { _array } }) => {
          setMatches(_array);
        }
      );
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      loadMatches();
    }, [])
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() => navigation.navigate('Chat' as never, { matchId: item.id, matchName: item.username } as never)}
    >
      <Image source={{ uri: item.profile_picture }} style={styles.avatar} />
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{item.username}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.last_message || 'Start a conversation!'}
        </Text>
      </View>
      {item.last_message_time && (
        <Text style={styles.timestamp}>{formatTime(item.last_message_time)}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No matches yet!</Text>
          <Text style={styles.emptySubtext}>Keep swiping to find your match</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  matchItem: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.disabled + '20',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  lastMessage: {
    ...theme.typography.body,
    color: theme.colors.disabled,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.disabled,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.disabled,
    textAlign: 'center',
  },
});

export default ChatListScreen;
