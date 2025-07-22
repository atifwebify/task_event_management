'use client'
import { useEventDetails } from '@/context/EventDetailsContext'
import React from 'react'

const Details = ({ id }: { id: string }) => {


    const { event } = useEventDetails();

    // const { events } = useEvents();

    // const event = events.find(item => { return item.id === Number(id)})

    // console.log(filterEvent)

    return (
        <div>
            <h1>{event?.title}</h1>
            <p>{event?.description}</p>
        </div>
    )
}

export default Details
