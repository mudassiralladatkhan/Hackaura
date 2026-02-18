import React, { createContext, useContext, useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

interface AuthContextType {
    user: netlifyIdentity.User | null;
    login: () => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    isLoading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<netlifyIdentity.User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        netlifyIdentity.init();

        const user = netlifyIdentity.currentUser();
        setUser(user);
        setIsLoading(false);

        netlifyIdentity.on('login', (user) => {
            setUser(user);
            netlifyIdentity.close();
        });

        netlifyIdentity.on('logout', () => {
            setUser(null);
        });

        return () => {
            netlifyIdentity.off('login');
            netlifyIdentity.off('logout');
        }
    }, []);

    const login = () => {
        netlifyIdentity.open('login');
    };

    const logout = () => {
        netlifyIdentity.logout();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
