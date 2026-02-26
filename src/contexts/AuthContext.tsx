import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
    username: string;
    displayName: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    currentUser: AdminUser | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    currentUser: null,
    login: () => false,
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

// Admin credentials — add/change users here
const ADMIN_USERS: { username: string; password: string; displayName: string }[] = [
    { username: 'mudassir', password: 'mudassir@2026', displayName: "Mudassir & Sana's Team" },
    { username: 'pankaj', password: 'pankaj@2026', displayName: "Pankaj & Bhagya's Team" },
    { username: 'hod', password: 'hod@2026', displayName: "HOD Admin" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        // Check if admin was previously logged in (session persistence)
        const storedUser = sessionStorage.getItem('hackaura_admin_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser) as AdminUser;
                setCurrentUser(user);
                setIsAuthenticated(true);
            } catch {
                sessionStorage.removeItem('hackaura_admin_user');
            }
        }
    }, []);

    const login = (username: string, password: string): boolean => {
        const found = ADMIN_USERS.find(
            u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );
        if (found) {
            const user: AdminUser = { username: found.username, displayName: found.displayName };
            setCurrentUser(user);
            setIsAuthenticated(true);
            sessionStorage.setItem('hackaura_admin_user', JSON.stringify(user));
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        sessionStorage.removeItem('hackaura_admin_user');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
