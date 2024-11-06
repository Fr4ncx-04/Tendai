import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Membership {
  
  id_usuario: number;
  name: string;
  color: string;
  expiryDate: Date;
  purchaseDate: Date;
  benefits: string[];
  
}

interface User {
  id_usuario: number;
  name: string;
  email: string;
  type: 'user' | 'company' | 'admin';
  membership?: Membership;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  userType: string | null;
  login: (user: User) => void;
  logout: () => void;
  updateMembership: (membership: Membership) => void;
  checkMembershipStatus: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const isLoggedIn = !!user;

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchMembershipData();
    }
  }, [isLoggedIn, user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateMembership = (membership: Membership) => {
    if (user) {
      setUser({ ...user, membership });
    }
  };

  const fetchMembershipData = async () => {
    if (!user) return;

    try {
        const response = await fetch(`http://localhost:3001/membership/${user.id_usuario}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched membership data:', data);

        setUser((prevUser) => {
            if (!prevUser) return null;

            return {
                ...prevUser,
                membership: {
                    id_usuario: data.ID_Usuario,  
                    name: data.Nombre,             
                    color: data.Color,
                    purchaseDate: new Date(data.Fecha_Inicio),
                    expiryDate: new Date(data.Fecha_Expiracion),
                    benefits: data.Beneficios || [], 
                },
            };
        });
    } catch (error) {
        console.error('Error fetching membership data:', error);
    }
};

  
  
  
  
  
const checkMembershipStatus = (): boolean => {
  if (!user?.membership) {
      console.log('No membership found');
      return false;
  }
  const expiryDate = new Date(user.membership.expiryDate);
  const isActive = expiryDate > new Date();
  console.log(`Membership status: ${isActive}`);
  return isActive;
};


  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        userType: user?.type || null,
        login,
        logout,
        updateMembership,
        checkMembershipStatus,
      }}
    >
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
