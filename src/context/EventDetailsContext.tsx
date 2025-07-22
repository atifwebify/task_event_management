'use client'
import { db, Event } from "@/lib/db"
import React, { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"


type detailsContext = {
    id: string
    children: React.ReactNode
}

interface context {
    event?: Event | null
}

const EventDetailsContext = createContext<context | undefined>(undefined)


export const EventDetailProvider = ({ id, children }: detailsContext) => {

    const [event, setEvent] = useState<Event | undefined>(undefined)

    const loadDetailEvent = async (id: string) => {
        const event = await db.events.where({ id: Number(id) }).first();
        if (!event) {
            toast.error("Event Not found")
            return false;
        }
        setEvent(event)
    }

    useEffect(() => {
        if (id) {
            loadDetailEvent(id)
        }
    }, [id])

    return <EventDetailsContext.Provider value={{ event }}>
        {children}
    </EventDetailsContext.Provider>
}


export const useEventDetails = () => {
    const context = useContext(EventDetailsContext)
    if (context === undefined) {
        throw new Error('Eevent Details must be used within a EventsDetailsProvider');
    }
    return context;
}