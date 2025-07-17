'use client'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Calendar, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Header = () => {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="flex items-center">
                            <Calendar className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                                EventHub
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-sm font-medium text-gray-700">{user.username}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={logout}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 p-2 h-10 w-10 rounded-full"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;