
import { Tooltip } from '@mantine/core'

import type { EventType } from '@/types/event'
import { cn } from '@/lib/utils'

type EventProps = {
  data: EventType
}

const Eventw = (props: EventProps) => {
  const { name, description, amount, date, type, id } = props.data

  return (
    <Tooltip 
    label={description} 
    position="bottom-start" offset={2}
    arrowOffset={50} arrowSize={8}
    events={{hover:true, focus:false, touch: false}}
    withArrow 
    >
      <div className={cn(
        'px-4 py-2 hover:bg-zinc-100 hover:dark:bg-zinc-500',
        'rounded-sm')}>
        <a href={`/form/${id}`}>
        <div className='flex flex-raw justify-between gap-4'>
          <div className='flex flex-col justify-between text-gray-700'>
            <p className="text-sm  text-gray-700 dark:text-zinc-200">{name}</p>
            <p className=" text-xs justify-between text-gray-500 dark:text-zinc-400 ">{date}</p>
          </div>
          <div>
            {type==='Income' && <p className="text-sm text-green-500">${amount}</p>}
            {type==='Expense' && <p className="text-sm text-red-500">${amount}</p>}
          </div>
        </div>
      </a>
      </div>
    </Tooltip>
  )
}

export default Eventw
