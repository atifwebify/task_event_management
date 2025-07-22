import React from 'react'
import Details from './Details';
import { EventDetailProvider } from '@/context/EventDetailsContext';

const page = async ({ params }: { params: { id: string } }) => {

    const { id } = await params;

    return (
        <EventDetailProvider id={id}>
            <Details id={id} />
        </EventDetailProvider>
    )
}

export default page
