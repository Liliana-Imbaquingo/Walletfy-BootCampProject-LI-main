import type DataDS from '@/api/domain/ds/DataDS'
import type { CreateEventType, EventType, UpdateEventType } from '@/types/event'

// Implementation of the DataDS interface IMPLEMENTA LA LÓGICA DE NUESTRO DS USANDO LOCALSTORAGe
// This class provides methods to interact with the data source, such as fetching, saving, and
class DataRepoImpl {
  constructor(private data: DataDS) {}   // Tipo clase abstracta y no localStorage para no cambiar el código si cambio mi fuente de datos

  async getEvents(state?: string): Promise<Array<EventType>> {
    return await this.data.getEvents(state)
  }

  async getEventById(id: string): Promise<EventType> {
    return await this.data.getEventById(id)
  }

  async saveEvent(event: CreateEventType): Promise<boolean> {
    return await this.data.saveEvent(event)
  }

  async updateEvent(candidate: UpdateEventType): Promise<boolean> {
    return await this.data.updateEvent(candidate)
  }

}

export default DataRepoImpl
