'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEvents } from '@/context/EventsContext';
import EventForm, { EventFormData } from '../../../_components/EventForm';
import { useEffect, useState } from 'react';
import { Event } from '@/lib/db';
import { Loader } from '../../../_components/Loader';

export default function EditEventPage() {
    const { id } = useParams();
    const { getEventById, updateEvent } = useEvents();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);

    useEffect(() => {
        const loadEvent = async () => {
            const eventId = Number(id);
            const eventData = await getEventById(eventId);
            if (eventData) {
                setEvent({
                    ...eventData,
                    startDateTime: new Date(eventData.startDateTime),
                    endDateTime: new Date(eventData.endDateTime),
                });
            } else {
                router.push('/dashboard');
            }
        };
        loadEvent();
    }, [id, getEventById, router]);

    const handleSubmit = async (data: EventFormData) => {
        try {
            await updateEvent(Number(id), data);
            router.push('/dashboard');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to update event');
        }
    };

    if (!event) {
        return <div className='min-h-screen w-full flex items-center justify-center'>
            <Loader />
        </div>
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
            <EventForm
                defaultValues={event}
                onSubmit={handleSubmit}
                isEditing={true}
            />
        </div>
    );
}