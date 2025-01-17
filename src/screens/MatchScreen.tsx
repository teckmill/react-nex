import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';
import db from '../database/db';

const SWIPE_THRESHOLD = 120;

const MatchScreen = () => {
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = new Animated.ValueXY();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM users WHERE id NOT IN 
        (SELECT swiped_user_id FROM swipes WHERE user_id = (SELECT MAX(id) FROM users))
        AND id != (SELECT MAX(id) FROM users)`,
        [],
        (_, { rows: { _array } }) => {
          setProfiles(_array);
        }
      );
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeLeft();
      } else {
        resetPosition();
      }
    },
  });

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SWIPE_THRESHOLD * 2, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      handleSwipe('left');
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SWIPE_THRESHOLD * 2, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      handleSwipe('right');
    });
  };

  const handleSwipe = (direction) => {
    const currentProfile = profiles[currentIndex];
    
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO swipes (user_id, swiped_user_id, direction) VALUES ((SELECT MAX(id) FROM users), ?, ?)',
        [currentProfile.id, direction],
        (_, result) => {
          if (direction === 'right') {
            checkMatch(currentProfile.id);
          }
          nextProfile();
        }
      );
    });
  };

  const checkMatch = (swipedUserId) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM swipes 
        WHERE user_id = ? 
        AND swiped_user_id = (SELECT MAX(id) FROM users)
        AND direction = 'right'`,
        [swipedUserId],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            // It's a match!
            createMatch(swipedUserId);
          }
        }
      );
    });
  };

  const createMatch = (matchedUserId) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO matches (user_id, match_id, status) VALUES ((SELECT MAX(id) FROM users), ?, "active")',
        [matchedUserId],
        (_, result) => {
          navigation.navigate('ChatList' as never);
        }
      );
    });
  };

  const nextProfile = () => {
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };

  const rotate = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD * 2, 0, SWIPE_THRESHOLD * 2],
    outputRange: ['-30deg', '0deg', '30deg'],
  });

  if (currentIndex >= profiles.length) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No more profiles to show!</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadProfiles}
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.card, {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { rotate: rotate },
          ]
        }]}
        {...panResponder.panHandlers}
      >
        <Image source={{ uri: currentProfile.profile_picture }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{currentProfile.username}</Text>
          <Text style={styles.bio}>{currentProfile.bio}</Text>
          <Text style={styles.interests}>{currentProfile.interests}</Text>
        </View>
      </Animated.View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.passButton]} onPress={swipeLeft}>
          <Text style={styles.buttonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.likeButton]} onPress={swipeRight}>
          <Text style={styles.buttonText}>♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  card: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.medium,
  },
  image: {
    flex: 2,
    width: '100%',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  info: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  name: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.sm,
  },
  bio: {
    ...theme.typography.body,
    marginBottom: theme.spacing.md,
  },
  interests: {
    ...theme.typography.caption,
    color: theme.colors.primary,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.lg,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  passButton: {
    backgroundColor: theme.colors.error,
  },
  likeButton: {
    backgroundColor: theme.colors.secondary,
  },
  buttonText: {
    fontSize: 30,
    color: theme.colors.background,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.lg,
  },
  refreshButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  refreshButtonText: {
    color: theme.colors.background,
    ...theme.typography.body,
  },
});

export default MatchScreen;
