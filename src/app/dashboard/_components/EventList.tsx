import { useFilter } from '@/context/FilterContext'
import React from 'react'
import EventCard from './EventCard'
import Link from 'next/link'
import { CalendarPlus } from 'lucide-react';

const EventList = () => {

    const {
        filteredEvents
    } = useFilter()

    return (
        filteredEvents.length === 0 ? (
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
        )
    )
}

export default EventList
