'use client';

import { useEvents } from '../../context/EventsContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import Link from 'next/link';
import EventCard from './_components/EventCard';
import { CalendarPlus } from 'lucide-react';
import { Loader } from './_components/Loader';
import Filters from './_components/Filters';
import { FilterProvider } from '@/context/FilterContext';
import EventList from './_components/EventList';


export default function Home() {
    const { events } = useEvents();
    const { user } = useAuth();




    if (user) {
        return (
            <div className="space-y-8 w-full p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Event Dashboard</h1>
                    </div>
                    <Link href="/dashboard/create" className="button flex gap-2 items-center">
                        <CalendarPlus className="h-4 w-4" />
                        Create New Event
                    </Link>
                </div>

                <FilterProvider events={events}>
                    <Filters />
                    <EventList />
                </FilterProvider >
            </div>
        );

    } else {
        return <div className='min-h-screen w-full flex items-center justify-center'>
            <Loader />
        </div>
    }
}