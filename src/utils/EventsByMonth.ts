import dayjs from 'dayjs';
import type { monthType } from "@/types/month";
import type { EventType } from "@/types/event";
import DataRepo from "@/api/datasource"


export const eventsByMonth = async (initialValue:number) => {
    const eventsBMonth: Array<monthType> = [];
    let globalPrev=initialValue;
    const eventsList: Array<EventType> = await DataRepo.getEvents();
    eventsList.sort((a,b) => parseInt(a.date.replaceAll('-', ''))-parseInt(b.date.replaceAll('-', '')))
    for(const event of eventsList) {
        const [year, month] = event.date.split('-')
        const inc= event.type === 'Income' ? event.amount : 0;
        const exp= event.type === 'Expense' ? event.amount : 0;
        const monthly= inc-exp
        globalPrev= globalPrev+monthly
        const MonthExists= eventsBMonth.some(e => e.year === parseInt(year) && e.month === parseInt(month))
        if(!MonthExists) {
            eventsBMonth.push(
            {
                name: dayjs(`${year}-${month}-01`).format('MMMM'),
                month: parseInt(month),
                year: parseInt(year),
                events: [event],
                incomes: inc,
                expenses: exp,
                monthly: monthly,
                global: globalPrev,
            }         
            )
        }else{
            const monthIndex = eventsBMonth.findIndex(e => e.year === parseInt(year) && e.month === parseInt(month));
            eventsBMonth[monthIndex].events.push(event);
            eventsBMonth[monthIndex].incomes += inc;
            eventsBMonth[monthIndex].expenses += exp;
            eventsBMonth[monthIndex].monthly += monthly;
            eventsBMonth[monthIndex].global += inc-exp;
        }
    }

    globalPrev=0
    return eventsBMonth;
}

export default eventsByMonth;