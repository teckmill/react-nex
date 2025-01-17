import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { theme } from '../styles/theme';
import db from '../database/db';

const BADGES = {
  CONVERSATION_STARTER: {
    id: 'conversation_starter',
    title: 'Conversation Starter',
    description: 'Started 5 conversations',
    icon: '💬',
    requirement: 5,
  },
  RESPECTFUL_ENDER: {
    id: 'respectful_ender',
    title: 'Respectful Ender',
    description: 'Ended 3 conversations respectfully',
    icon: '🤝',
    requirement: 3,
  },
  ACTIVE_DATER: {
    id: 'active_dater',
    title: 'Active Dater',
    description: 'Used the app for 7 days',
    icon: '⭐',
    requirement: 7,
  },
  MATCH_MAKER: {
    id: 'match_maker',
    title: 'Match Maker',
    description: 'Got 5 matches',
    icon: '❤️',
    requirement: 5,
  },
};

const BadgesScreen = () => {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [stats, setStats] = useState({
    conversationsStarted: 0,
    respectfulEndings: 0,
    daysActive: 0,
    matches: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    db.transaction(tx => {
      // Count conversations started
      tx.executeSql(
        'SELECT COUNT(DISTINCT match_id) as count FROM messages WHERE sender_id = (SELECT MAX(id) FROM users)',
        [],
        (_, { rows }) => {
          setStats(prev => ({ ...prev, conversationsStarted: rows._array[0].count }));
          checkBadge('CONVERSATION_STARTER', rows._array[0].count);
        }
      );

      // Count respectful endings
      tx.executeSql(
        'SELECT COUNT(*) as count FROM matches WHERE user_id = (SELECT MAX(id) FROM users) AND status = "ended"',
        [],
        (_, { rows }) => {
          setStats(prev => ({ ...prev, respectfulEndings: rows._array[0].count }));
          checkBadge('RESPECTFUL_ENDER', rows._array[0].count);
        }
      );

      // Count matches
      tx.executeSql(
        'SELECT COUNT(*) as count FROM matches WHERE user_id = (SELECT MAX(id) FROM users)',
        [],
        (_, { rows }) => {
          setStats(prev => ({ ...prev, matches: rows._array[0].count }));
          checkBadge('MATCH_MAKER', rows._array[0].count);
        }
      );

      // Calculate days active (based on first message)
      tx.executeSql(
        'SELECT julianday("now") - julianday(MIN(timestamp)) as days FROM messages WHERE sender_id = (SELECT MAX(id) FROM users)',
        [],
        (_, { rows }) => {
          const days = Math.floor(rows._array[0].days || 0);
          setStats(prev => ({ ...prev, daysActive: days }));
          checkBadge('ACTIVE_DATER', days);
        }
      );
    });
  };

  const checkBadge = (badgeKey, value) => {
    const badge = BADGES[badgeKey];
    if (value >= badge.requirement && !earnedBadges.includes(badge.id)) {
      setEarnedBadges(prev => [...prev, badge.id]);
      
      // Save badge to database
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE users SET badges = ? WHERE id = (SELECT MAX(id) FROM users)',
          [JSON.stringify([...earnedBadges, badge.id])]
        );
      });
    }
  };

  const renderBadge = ({ item: badgeKey }) => {
    const badge = BADGES[badgeKey];
    const isEarned = earnedBadges.includes(badge.id);
    const progress = Math.min(
      stats[{
        CONVERSATION_STARTER: 'conversationsStarted',
        RESPECTFUL_ENDER: 'respectfulEndings',
        ACTIVE_DATER: 'daysActive',
        MATCH_MAKER: 'matches',
      }[badgeKey]] / badge.requirement,
      1
    );

    return (
      <View style={[styles.badgeContainer, !isEarned && styles.unearned]}>
        <Text style={styles.badgeIcon}>{badge.icon}</Text>
        <View style={styles.badgeInfo}>
          <Text style={styles.badgeTitle}>{badge.title}</Text>
          <Text style={styles.badgeDescription}>{badge.description}</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Badges</Text>
      <FlatList
        data={Object.keys(BADGES)}
        renderItem={renderBadge}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.badgesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  badgesList: {
    padding: theme.spacing.sm,
  },
  badgeContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  unearned: {
    opacity: 0.5,
  },
  badgeIcon: {
    fontSize: 30,
    marginRight: theme.spacing.md,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  badgeDescription: {
    ...theme.typography.body,
    color: theme.colors.disabled,
    marginBottom: theme.spacing.md,
  },
  progressContainer: {
    height: 4,
    backgroundColor: theme.colors.disabled + '20',
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
});

export default BadgesScreen;
