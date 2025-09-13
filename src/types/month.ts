import type { EventType } from './event';

export type monthType = {
    name: string,
    month: number,
    year: number,
    events: Array<EventType>,
    incomes: number,
    expenses: number,
    monthly: number,
    global: number,
}

