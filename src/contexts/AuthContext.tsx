import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => false,

    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

// Admin credentials — change these to whatever you want
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'hackaura@admin2026';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if admin was previously logged in (session persistence)
        const stored = sessionStorage.getItem('hackaura_admin_auth');
        if (stored === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (username: string, password: string): boolean => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem('hackaura_admin_auth', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('hackaura_admin_auth');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
