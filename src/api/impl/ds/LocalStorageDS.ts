import type DataDS from '@/api/domain/ds/DataDS'
import type {
  CreateEventType,
  EventType,
  UpdateEventType,
} from '@/types/event'

const EVENTS_KEY = 'events'

const sleep = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

class LocalStorageDS implements DataDS {
  async getEvents(type?: string) {
    try {
      await sleep()

      const eventsRaw = localStorage.getItem(EVENTS_KEY) ?? '[]'

      const events = JSON.parse(eventsRaw) as Array<EventType>
      return events.filter((event) => {
        if (type) {
          return event.type === type
        }

        return true
      })
    } catch (error) {
      throw new Error('Error loading users')
    }
  }

  async getEventById(id: string): Promise<EventType> {
    try {
      await sleep()

      const eventsRaw = localStorage.getItem(EVENTS_KEY) ?? '[]'

      const events = JSON.parse(eventsRaw) as Array<EventType>

      const event = events.find((c) => c.id === id)

      if (!event) {
        throw new Error('Event not found')
      }

      return event
    } catch (error) {
      throw new Error('Error loading event')
    }
  }

  async saveEvent(event: CreateEventType): Promise<boolean> {
    try {
      await sleep()

      const eventsRaw = localStorage.getItem(EVENTS_KEY) ?? '[]'

      const events = JSON.parse(eventsRaw) as Array<EventType>

      const newEvent: EventType = {
        ...event,
        id: crypto.randomUUID(),
        
      }

      events.push(newEvent)

      localStorage.setItem(EVENTS_KEY, JSON.stringify(events))

      return true
    } catch (error) {
      throw new Error('Error saving event')
    }
  }

  async updateEvent(event: UpdateEventType): Promise<boolean> {
    try {
      await sleep()

      const eventsRaw = localStorage.getItem(EVENTS_KEY) ?? '[]'

      const events = JSON.parse(eventsRaw) as Array<EventType>

      const eventIndex = events.findIndex((c) => c.id === event.id)

      if (eventIndex === -1) {
        throw new Error('Event not found')
      }

      events[eventIndex] = {
        ...events[eventIndex],
        ...event,
      }

      localStorage.setItem(EVENTS_KEY, JSON.stringify(events))

      return true
    } catch (error) {
      throw new Error('Error updating event')
    }
  }


}

export default LocalStorageDS
