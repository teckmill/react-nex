import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  bio?: string;
  interests?: string;
  profile_picture?: string;
  badges?: string;
}

interface SQLiteRows {
  length: number;
  item(index: number): any;
  _array: any[];
}

interface SQLiteResult {
  insertId?: number;
  rowsAffected: number;
  rows: SQLiteRows;
}

interface Database {
  initDatabase: () => Promise<void>;
  insertUser: (username: string, email: string, password: string) => Promise<boolean>;
  findUserByEmail: (email: string, password: string) => Promise<User | null>;
  updateUser: (userId: number, bio: string, interests: string, profilePicture: string) => Promise<boolean>;
  checkEmailExists: (email: string) => Promise<boolean>;
}

// SQLite is not supported on web platforms
const db = Platform.OS === 'web' ? null : SQLite.openDatabaseSync('accountadate.db');

export const initDatabase = async () => {
  if (!db) {
    throw new Error('SQLite is not supported on web platforms');
  }

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        bio TEXT,
        interests TEXT,
        profile_picture TEXT,
        badges TEXT
      );
    `);
  } catch (error) {
    throw error;
  }
};

export const insertUser = async (username: string, email: string, password: string): Promise<boolean> => {
  if (!db) {
    throw new Error('SQLite is not supported on web platforms');
  }

  try {
    const statement = await db.prepareAsync('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    await statement.executeAsync([username, email, password]);
    await statement.finalizeAsync();
    return true;
  } catch (error) {
    console.error('Error inserting user:', error);
    return false;
  }
};

export const findUserByEmail = async (email: string, password: string): Promise<User | null> => {
  if (!db) {
    throw new Error('SQLite is not supported on web platforms');
  }

  try {
    const statement = await db.prepareAsync('SELECT * FROM users WHERE email = ? AND password = ?');
    const result = await statement.executeAsync<User>([email, password]);
    const user = await result.getFirstAsync();
    await statement.finalizeAsync();
    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

export const updateUser = async (userId: number, bio: string, interests: string, profilePicture: string): Promise<boolean> => {
  if (!db) {
    throw new Error('SQLite is not supported on web platforms');
  }

  try {
    const statement = await db.prepareAsync('UPDATE users SET bio = ?, interests = ?, profile_picture = ? WHERE id = ?');
    await statement.executeAsync([bio, interests, profilePicture, userId]);
    await statement.finalizeAsync();
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  if (!db) {
    throw new Error('SQLite is not supported on web platforms');
  }

  try {
    const statement = await db.prepareAsync('SELECT * FROM users WHERE email = ?');
    const result = await statement.executeAsync<User>([email]);
    const user = await result.getFirstAsync();
    await statement.finalizeAsync();
    return user !== null;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};

interface Database {
  initDatabase: () => Promise<void>;
  insertUser: (username: string, email: string, password: string) => Promise<boolean>;
  findUserByEmail: (email: string, password: string) => Promise<User | null>;
  updateUser: (userId: number, bio: string, interests: string, profilePicture: string) => Promise<boolean>;
  checkEmailExists: (email: string) => Promise<boolean>;
}

const database: Database = {
  initDatabase,
  insertUser,
  findUserByEmail,
  updateUser,
  checkEmailExists
};

export default database;
