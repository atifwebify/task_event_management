'use client';

import { useRouter } from 'next/navigation';
import { useEvents } from '@/context/EventsContext';
import EventForm, { EventFormData } from '../_components/EventForm';
import { toast } from 'sonner';

export default function CreateEventPage() {
    const { addEvent } = useEvents();
    const router = useRouter();

    const handleSubmit = async (data: EventFormData) => {
        try {
            await addEvent(data);
            router.push('/dashboard');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create event')
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
            <EventForm onSubmit={handleSubmit} />
        </div>
    );
}