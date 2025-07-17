import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { useState } from 'react';

interface PasswordInputProps {
    id: string;
    register: UseFormRegisterReturn;
    errors?: FieldError;
    placeholder?: string;
}

const PasswordInput = ({ id, register, errors, placeholder }: PasswordInputProps) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {id === 'confirmPassword' ? 'Confirm Password' : 'Password'}
            </Label>
            <Input
                id={id}
                type={visible ? 'text' : 'password'}
                {...register}
                placeholder={placeholder || '••••••••'}
                className="w-full pr-10"
            />
            <button
                type="button"
                onClick={() => setVisible((prev) => !prev)}
                className="cursor-pointer absolute right-3 top-[33px] text-gray-500 hover:text-gray-700"
            >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
        </div>
    );
};

export default PasswordInput;
