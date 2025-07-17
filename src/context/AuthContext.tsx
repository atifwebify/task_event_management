'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { db, User } from '../lib/db';
import { toast } from 'sonner';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (user: Omit<User, 'id'>) => Promise<boolean>;
    logout: () => void;
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check if user is logged in on initial load
        const checkAuth = async () => {
            try {
                setLoading(true)
                const users = await db.users.toArray();
                const loggedInUser = localStorage.getItem('currentUser');
                if (loggedInUser && users.some(u => u.email === loggedInUser)) {
                    const user = users.find(u => u.email === loggedInUser);
                    if (user) setUser(user);
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to create event')
            } finally {
                setLoading(false)
            }
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const user = await db.users.where({ email, password }).first();
        if (user) {
            setUser(user);
            localStorage.setItem('currentUser', email);
            return true;
        }
        return false;
    };

    const signup = async (newUser: Omit<User, 'id'>) => {
        const existingUser = await db.users.where({ email: newUser.email }).first();
        if (existingUser) {
            toast.error("User with this email Already Exists")
            return false
        };

        const id = await db.users.add(newUser as User);
        setUser({ ...newUser, id: id as number });
        localStorage.setItem('currentUser', newUser.email);
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}