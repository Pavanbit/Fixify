import React, { createContext, useState, useContext, useEffect } from 'react';

type UserType = 'user' | 'worker' | null;

interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  profileImage?: string;
  skills?: string[];
  rating?: number;
}

interface AuthContextType {
  currentUser: User | null;
  userType: UserType;
  isAuthenticated: boolean;
  login: (email: string, password: string, userType: UserType) => Promise<void>;
  register: (name: string, email: string, password: string, userType: UserType) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  updateLocation: (lat: number, lng: number, address: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('fixify_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setUserType(parsedUser.userType);
      setIsAuthenticated(true);
    }
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string, type: UserType) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const userData: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      userType: type,
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: 'New York, NY'
      },
      profileImage: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
      rating: 4.5
    };
    
    if (type === 'worker') {
      userData.skills = ['Plumbing', 'Electrical', 'Carpentry'];
    }
    
    setCurrentUser(userData);
    setUserType(type);
    setIsAuthenticated(true);
    localStorage.setItem('fixify_user', JSON.stringify(userData));
  };

  // Mock register function
  const register = async (name: string, email: string, password: string, type: UserType) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const userData: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      userType: type,
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: 'New York, NY'
      },
      profileImage: `https://ui-avatars.com/api/?name=${name}&background=random`,
      rating: 0
    };
    
    if (type === 'worker') {
      userData.skills = [];
    }
    
    setCurrentUser(userData);
    setUserType(type);
    setIsAuthenticated(true);
    localStorage.setItem('fixify_user', JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fixify_user');
  };

  const updateProfile = async (userData: Partial<User>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem('fixify_user', JSON.stringify(updatedUser));
    }
  };

  const updateLocation = (lat: number, lng: number, address: string) => {
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        location: { lat, lng, address } 
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('fixify_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    currentUser,
    userType,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    updateLocation
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};