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

const EventDetailsContext = createContext<context>({})


export const EventDetailProvider = ({ id, children }: detailsContext) => {

    const [event, setEvent] = useState<Event | null>(null)

    console.log(id)

    const loadDetailEvent = async () => {
        const event = await db.events.where({ id: id }).first();
        if (!event) {
            toast.error("Event Not found")
            return false;
        }
        setEvent(event)
        return event
    }

    useEffect(() => {
        loadDetailEvent()
    },[])

    return <EventDetailsContext.Provider value={{ event }}>
        {children}
    </EventDetailsContext.Provider>
}


export const useEventDetails = () => {
    const context = useContext(EventDetailsContext)
    return context;
}