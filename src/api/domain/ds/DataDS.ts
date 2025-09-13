import type { CreateEventType, EventType, UpdateEventType } from '@/types/event'
// nombres, parametros y tipos de datos que retorna
abstract class DataDS {

  abstract getEvents(state?: string): Promise<Array<EventType>>

  abstract getEventById(id: string): Promise<EventType>

  abstract saveEvent(event: CreateEventType): Promise<boolean>

  abstract updateEvent(event: UpdateEventType): Promise<boolean>

}

export default DataDS
