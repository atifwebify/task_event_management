'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
    FieldValues,
    UseFormSetValue,
    UseFormWatch,
    Path,
} from 'react-hook-form'

interface DateTimeProps<T extends FieldValues> {
    label: string
    fieldName: Path<T>
    disabled?: Date
    watch: UseFormWatch<T>
    setValue: UseFormSetValue<T>
    error?: string
}

export default function DateTime<T extends FieldValues>({
    label,
    fieldName,
    watch,
    setValue,
    disabled,
    error,
}: DateTimeProps<T>) {
    const rawValue: Date = watch(fieldName)
    const value = rawValue instanceof Date ? rawValue : rawValue ? new Date(rawValue) : undefined

    return (
        <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="input"
                        className={cn(
                            'w-full justify-start text-left font-normal overflow-hidden',
                            !value && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? format(value, 'PPPp') : <span>Select {label.toLowerCase()}</span>}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={value instanceof Date ? value : undefined}
                        disabled={(date) => {
                            if (disabled instanceof Date) {
                                const selected = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                                const minDate = new Date(disabled.getFullYear(), disabled.getMonth(), disabled.getDate())
                                return selected < minDate
                            }
                            return false
                        }}

                        onSelect={(date) => {
                            if (date) {
                                setValue(fieldName, date as T[typeof fieldName], {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                    shouldTouch: true,
                                })
                            }
                        }}
                        initialFocus
                    />
                    <div className="p-3 border-t">
                        <Input
                            type="time"
                            value={value instanceof Date ? format(value, 'HH:mm') : ''}
                            onChange={(e) => {
                                const time = e.target.value;
                                if (time && value instanceof Date) {
                                    const [hours, minutes] = time.split(':').map(Number);
                                    const updatedDate = new Date(value);
                                    updatedDate.setHours(hours, minutes);
                                    setValue(fieldName, updatedDate as T[typeof fieldName], {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                        shouldTouch: true,
                                    });
                                }
                            }}
                        />
                    </div>

                </PopoverContent>
            </Popover>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}
