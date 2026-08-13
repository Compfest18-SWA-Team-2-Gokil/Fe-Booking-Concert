import type { Event } from '../models/Event';

export interface IEventRepository {
  getEvents(): Promise<Event[]>;
}
