'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { db, Event } from '../lib/db';
import { useAuth } from './AuthContext';

interface EventsContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => Promise<number>;
  updateEvent: (id: number, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  getEventById: (id: number) => Promise<Event | undefined>;
  checkTimeOverlap: (start: Date, end: Date, excludeId?: number) => boolean;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    if (!user) return;
    const userEvents = await db.events.where('organizer').equals(user.email).toArray();
    setEvents(userEvents);
  };

  const addEvent = async (event: Omit<Event, 'id'>) => {
    if (checkTimeOverlap(event.startDateTime, event.endDateTime)) {
      throw new Error('Event time overlaps with an existing event');
    }
    const id = await db.events.add({ ...event, organizer: user?.email || '' } as Event);
    await loadEvents();
    return id as number;
  };

  const updateEvent = async (id: number, event: Partial<Event>) => {
    if (event.startDateTime && event.endDateTime &&
      checkTimeOverlap(event.startDateTime, event.endDateTime, id)) {
      throw new Error('Event time overlaps with an existing event');
    }
    await db.events.update(id, event);
    await loadEvents();
  };

  const deleteEvent = async (id: number) => {
    await db.events.delete(id);
    await loadEvents();
  };

  const getEventById = async (id: number) => {
    return await db.events.get(id);
  };

  const checkTimeOverlap = (start: Date, end: Date, excludeId?: number) => {
    return events.some(event => {
      if (excludeId && event.id === excludeId) return false;
      return (
        (start >= event.startDateTime && start < event.endDateTime) ||
        (end > event.startDateTime && end <= event.endDateTime) ||
        (start <= event.startDateTime && end >= event.endDateTime)
      );
    });
  };

  return (
    <EventsContext.Provider value={{
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventById,
      checkTimeOverlap
    }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within a EventsProvider');
  }
  return context;
}