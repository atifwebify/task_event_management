'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link as LinkIcon, Loader2Icon, MapPin } from 'lucide-react';
import DateTime from './DateTime';

const eventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    eventType: z.enum(['Online', 'In-Person']),
    location: z.string().optional(),
    eventLink: z.string().optional(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    category: z.string().min(1, 'Category is required'),
}).superRefine((data, ctx) => {
    if (data.eventType === 'Online' && !data.eventLink) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Event link is required for online events',
            path: ['eventLink'],
        });
    }
    if (data.eventType === 'In-Person' && !data.location) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Location is required for in-person events',
            path: ['location'],
        });
    }
    if (data.endDateTime <= data.startDateTime) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'End date/time must be after start date/time',
            path: ['endDateTime'],
        });
    }
});

export type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
    defaultValues?: Partial<EventFormData>;
    onSubmit: (data: EventFormData) => Promise<void>;
    isEditing?: boolean;
}

export default function EventForm({ defaultValues, onSubmit, isEditing = false }: EventFormProps) {
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues,
    });

    const eventType = watch('eventType');

    const onError = (errors: FieldErrors<EventFormData>) => {
        console.log("❌ Erros", errors);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Edit Event' : 'Create New Event'}
                </h2>
                <p className="text-gray-600 mt-1">
                    {isEditing ? 'Update your event details' : 'Fill in the details for your new event'}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
                <div>
                    <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Title
                    </Label>
                    <Input
                        id="title"
                        {...register('title')}
                        placeholder="Enter event title"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div>
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        {...register('description')}
                        placeholder="Describe your event"
                        rows={4}
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Type
                        </Label>
                        <Select
                            value={watch('eventType')}
                            onValueChange={(value) => setValue('eventType', value as 'Online' | 'In-Person')}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Online">Online</SelectItem>
                                <SelectItem value="In-Person">In-Person</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.eventType && <p className="mt-1 text-sm text-red-600">{errors.eventType.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </Label>
                        <Input
                            id="category"
                            {...register('category')}
                            placeholder="Enter category"
                        />
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                    </div>
                </div>

                {/* Event Link or Location */}
                {eventType === 'Online' ? (
                    <div>
                        <Label htmlFor="eventLink" className="block text-sm font-medium text-gray-700 mb-1">
                            <div className="flex items-center">
                                <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
                                Event Link
                            </div>
                        </Label>
                        <Input
                            id="eventLink"
                            {...register('eventLink')}
                            placeholder="https://example.com/meeting"
                        />
                        {errors.eventLink && <p className="mt-1 text-sm text-red-600">{errors.eventLink.message}</p>}
                    </div>
                ) : (
                    <div>
                        <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                Location
                            </div>
                        </Label>
                        <Input
                            id="location"
                            {...register('location')}
                            placeholder="123 Main St, City, Country"
                        />
                        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
                    </div>
                )}

                {/* Start and End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DateTime<EventFormData>
                        label="Start Date & Time"
                        fieldName="startDateTime"
                        disabled={new Date(new Date().setDate(new Date().getDate() - 1))}
                        watch={watch}
                        setValue={setValue}
                        error={errors.startDateTime?.message}
                    />

                    <DateTime<EventFormData>
                        label="End Date & Time"
                        fieldName="endDateTime"
                        disabled={watch("startDateTime") || new Date(new Date().setDate(new Date().getDate() - 1))}
                        watch={watch}
                        setValue={setValue}
                        error={errors.endDateTime?.message}
                    />
                </div>

                <button
                    type="submit"
                    className="button w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <Loader2Icon className=' animate-spin' />
                            {isEditing ? 'Updating...' : 'Creating...'}
                        </span>
                    ) : (
                        <span>{isEditing ? 'Update Event' : 'Create Event'}</span>
                    )}
                </button>
            </form>
        </div>
    );
}
