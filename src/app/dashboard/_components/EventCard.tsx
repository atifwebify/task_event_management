'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Event } from '@/lib/db'
import { Calendar, MapPin, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { useEvents } from '@/context/EventsContext'

export default function EventCard({ event }: { event: Event }) {
    const [deleting, setDeleting] = useState(false)
    const { deleteEvent } = useEvents();

    const handleDelete = async (id: number | undefined) => {
        try {
            setDeleting(true)
            if (id) {
                await deleteEvent(id)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span
                        className={`px-2 py-1 text-xs rounded-full ${event.eventType === 'Online'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                            }`}
                    >
                        {event.eventType}
                    </span>
                </div>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>

                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                            {format(new Date(event.startDateTime), 'PPpp')} —{' '}
                            {format(new Date(event.endDateTime), 'PPpp')}
                        </span>
                    </div>

                    {event.eventType === 'Online' ? (
                        <Link href={event.eventLink as string} target="_blank" className="flex items-center text-gray-600">
                            <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
                            {event.eventLink?.slice(0, 45)}...
                        </Link>
                    ) : (
                        <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            {event.location}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex space-x-2">
                    <Link href={`/dashboard/events/${event.id}`} className='link-btn'>
                        Edit
                    </Link>

                    {/* Delete with confirmation */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the event &quot;{event.title}&quot;.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => { handleDelete(event?.id) }} disabled={deleting}>
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    )
}
