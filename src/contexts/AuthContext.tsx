import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signUp: (name: string, password: string) => { success: boolean; error?: string };
  logIn: (name: string, password: string) => { success: boolean; error?: string };
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'rarehelp_users';
const CURRENT_USER_KEY = 'rarehelp_current_user';

interface StoredUser {
  name: string;
  password: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  }, []);

  const getStoredUsers = (): StoredUser[] => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const signUp = (name: string, password: string): { success: boolean; error?: string } => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      return { success: false, error: 'Name is required' };
    }
    
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const users = getStoredUsers();
    const existingUser = users.find(u => u.name.toLowerCase() === trimmedName.toLowerCase());
    
    if (existingUser) {
      return { success: false, error: 'An account with this name already exists' };
    }

    // Add new user
    users.push({ name: trimmedName, password });
    saveUsers(users);

    // Auto login
    const newUser = { name: trimmedName };
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    return { success: true };
  };

  const logIn = (name: string, password: string): { success: boolean; error?: string } => {
    const trimmedName = name.trim();
    
    if (!trimmedName || !password) {
      return { success: false, error: 'Please fill in all fields' };
    }

    const users = getStoredUsers();
    const foundUser = users.find(
      u => u.name.toLowerCase() === trimmedName.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      return { success: false, error: 'Invalid name or password' };
    }

    const loggedInUser = { name: foundUser.name };
    setUser(loggedInUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser));

    return { success: true };
  };

  const logOut = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
