'use client';

import { useEvents } from '../../context/EventsContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import Link from 'next/link';
import EventCard from './_components/EventCard';
import { CalendarPlus } from 'lucide-react';
import { Loader } from './_components/Loader';
import Filters from './_components/Filters';


export default function Home() {
    const { events } = useEvents();
    const { user } = useAuth();

    const [filteredEvents, setFilteredEvents] = useState(events || [])    

   

    if (user) {
        return (
            <div className="space-y-8 w-full p-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Event Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                        </p>
                    </div>
                    <Link href="/dashboard/create" className="button flex gap-2 items-center">
                        <CalendarPlus className="h-4 w-4" />
                        Create New Event
                    </Link>
                </div>

                {/* Filters Section */}
                <Filters setFilteredEvents={setFilteredEvents} events={events} />

                {/* Events Grid */}
                {filteredEvents.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <div className="mx-auto max-w-md flex flex-col justify-center items-center">
                            <CalendarPlus className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
                            <p className="mt-1 text-gray-500">
                                    Get started by creating your first event
                            </p>
                            <div className="mt-6">
                                <Link href="/dashboard/create" className="button flex gap-2 items-center w-fit">
                                    <CalendarPlus className="h-4 w-4" />
                                    New Event
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        );

    } else {
        return <div className='min-h-screen w-full flex items-center justify-center'>
            <Loader />
        </div>
    }
}