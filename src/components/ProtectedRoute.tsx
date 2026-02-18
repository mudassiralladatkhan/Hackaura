import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading, login } = useAuth();
    const location = useLocation();

    useEffect(() => {
        // Optional: Auto-login prompt
        // if (!isLoading && !user) login();
    }, [isLoading, user, login]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
