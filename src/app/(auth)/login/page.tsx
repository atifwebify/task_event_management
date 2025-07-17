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
import { toast } from 'sonner';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        const success = await login(data.email, data.password);
        if (success) {
            router.push('/dashboard');
        } else {
            toast.error("Invalid Credentials")
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
                        <Calendar className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 text-center">Welcome to EventHub</h1>
                    <p className="text-gray-600 mt-2 text-center">Manage your events with ease</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Log in to your account</h2>
                        <p className="text-gray-600 mt-1">Enter your details below</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                        <div>
                            <PasswordInput
                                id="password"
                                register={register('password')}
                                errors={errors.password}
                                placeholder="Enter password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="button w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/signup"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}