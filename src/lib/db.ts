import Dexie, { Table } from 'dexie';

export type Event = {
  id?: number;
  title: string;
  description: string;
  eventType: 'Online' | 'In-Person';
  location?: string;
  eventLink?: string;
  startDateTime: Date;
  endDateTime: Date;
  category: string;
  organizer?: string;
};

export type User = {
  id?: number;
  username: string;
  email: string;
  password: string;
};

interface EventManagementDB {
  events: Table<Event, number>;
  users: Table<User, number>;
}

export const createEventManagementDB = (): Dexie & EventManagementDB => {
  const db = new Dexie('EventManagementDB') as Dexie & EventManagementDB;

  db.version(1).stores({
    events: '++id, title, eventType, startDateTime, endDateTime, category, organizer',
    users: '++id, username, email, password',
  });

  db.events = db.table('events');
  db.users = db.table('users');

  return db;
};

export const db = createEventManagementDB();
