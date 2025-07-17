'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DebouncedSearchProps {
    value: string;
    onDebounceChange: (value: string) => void;
    delay?: number;
    placeholder?: string
}
export function DebouncedSearchInput({ value, onDebounceChange, placeholder, delay = 300 }: DebouncedSearchProps) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            onDebounceChange(localValue);
        }, delay);

        return () => clearTimeout(handler);
    }, [localValue, delay, onDebounceChange]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
                placeholder={placeholder}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="w-full pl-10"
            />
        </div>
    );
}
