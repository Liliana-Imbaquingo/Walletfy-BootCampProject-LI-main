import { Paper } from "@mantine/core"
import Eventw from "./event";
import type { monthType } from "@/types/month"

type MonthProps = {
  data: monthType
}

const Month = (props: MonthProps) => {
  const { name, year, events, incomes, expenses, monthly, global } = props.data

  return (
    <Paper withBorder shadow="md" className="flex flex-col py-4 px-1 my-4 mx-2 w-[270px]  dark:text-zinc-300  ">
      <div className="flex mx-3 mb-1 gap-1  font-bold">
        <h1 className="text-xl  text-gray-800 dark:text-zinc-300 ">{name}</h1>
        <h1 className="text-xl  text-gray-800 dark:text-zinc-300 ">{year}</h1> 
      </div>
      <hr className="h-px my-3 mx-0 bg-gray-300 border-0 dark:bg-gray-700"></hr>
      <section className="min-h-[15rem]">
        {
          events.map((event) => (
           <Eventw  key={event.id} data={event} />  // Assuming Event is a component that displays event details  
          )
        ) 
          }
      </section>
      
      <hr className="h-px my-3 bg-gray-300 border-0 dark:bg-gray-600"></hr>
      <div className="px-4 mb-0 pb-0 text-sm ">
        <p className="flex items-center justify-between text-gray-600 dark:text-zinc-400 "><b>Income:</b> ${incomes}</p>
        <p className="flex items-center justify-between text-gray-600 dark:text-zinc-400"><b>Expense:</b> ${expenses}</p>
        <p className="flex items-center justify-between text-gray-600 dark:text-zinc-400"><b>Monthly:</b> ${monthly}</p>
        <p className="flex items-center justify-between text-gray-600 dark:text-zinc-400"><b>Global:</b> ${global}</p>
    </div>
    </Paper>
  )
}

export default Month