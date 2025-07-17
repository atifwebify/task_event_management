'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import PasswordInput from '@/app/dashboard/_components/PasswordInput';
import { useEffect } from 'react';
import { Loader } from '@/app/dashboard/_components/Loader';

const signupSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const { signup, loading, user } = useAuth();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: Omit<SignupFormData, 'confirmPassword'>) => {
        const success = await signup(data);
        if (success) {
            router.push('/dashboard');
        }
    };

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [loading, user, router]);


    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
                        <Calendar className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 text-center">Join EventHub</h1>
                    <p className="text-gray-600 mt-2 text-center">Create your account to get started</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Create your account</h2>
                        <p className="text-gray-600 mt-1">Fill in your details below</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </Label>
                            <Input
                                id="username"
                                {...register('username')}
                                className="w-full"
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email')}
                                className="w-full"
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <PasswordInput
                            id="password"
                            register={register('password')}
                            errors={errors.password}
                            placeholder="Enter password"
                        />

                        <PasswordInput
                            id="confirmPassword"
                            register={register('confirmPassword')}
                            errors={errors.confirmPassword}
                            placeholder="Enter confirm password"
                        />

                        <button
                            type="submit"
                            className="w-full button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}