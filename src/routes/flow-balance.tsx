
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {  useCallback, useEffect , useMemo, useState} from 'react';
import Month from '../components/month';
import type { monthType } from '@/types/month';
import eventsByMonth from '@/utils/EventsByMonth';
import { useDebounce } from '@/hooks/debounce';
import { cn } from '@/lib/utils';
import SearchInput from '@/components/Search';


export const Route = createFileRoute('/flow-balance')({
  component: RouteComponent,
})
function RouteComponent() {
  const queryClient = useQueryClient();
  const {isPending, data: eventsMonth, error} = useQuery({
    queryKey: ['eventsMonth'],
    queryFn: () => eventsByMonth(inputValue),
    retry: 3, // Retryfailed requests up to 3 times
    refetchOnWindowFocus: true, // Refetch when the window is focused
    refetchIntervalInBackground: false, // Do not refetch in the background  
  })
  
  useEffect(() => {
    return() => {
      queryClient.invalidateQueries({
        queryKey: ["eventsMonth"]
      })
    }
  },[])
  
const [searchResults, setSearchResults] = useState<Array<monthType>>([]);
const [inputValue, setInputValue] = useState(()=>{
  return 0
});
const mutation = useMutation({
    mutationFn: eventsByMonth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventsMonth'] });
    },
  });

const handleSave = () => {
  setInputValue(inputValue);
  mutation.mutate(inputValue); 
  };

  const visibleMonths = useMemo(() =>{
    if(!eventsMonth || eventsMonth.length === 0){
      return []
    }

    if(searchResults.length===0){
      return eventsMonth
    }
    return searchResults
  },[searchResults,eventsMonth]
  )

  const[debouncedSearchValue,setSearchValue, searchValue] =useDebounce('',3000)
  const filterMonths = useCallback( function (value:string): Array<monthType>{
    if(!eventsMonth || eventsMonth.length === 0){
      return []
    }
    if(value.length === 0){
      return eventsMonth;
    }
    return eventsMonth.filter((m) => m.name.includes(value) || m.year.toString().includes(value)) 
  },[eventsMonth])

  useEffect(() => {
    const result = filterMonths(debouncedSearchValue);
    setSearchResults(result);

  },[debouncedSearchValue,eventsMonth])

  if (isPending) {
    return <div className="p-4">Loading...</div>
  }
  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>
  }


  // chat box   

  // chat box end
  return (
    <div className="p-4 dark:bg-zinc-800 dark:text-white">
      <div className='flex flex-row justify-between'>
        <div className="flex flex-row justify-between items-center px-3 py-4 ">
        <h3 className=' pr-3 font-bold '>Initial Amount:</h3>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(parseInt(e.target.value))}
          placeholder="0"
          className='border h-[35px] w-[150px] rounded-md dark:bg-zinc-900'
        />
        <button
        className={cn(
          'bg-blue-500 text-white font-bold py-2 px-4 mx-3 rounded',
          'hover:bg-blue-700 focus:outline-none focus:shadow-outline',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition duration-150 ease-in-out',
          'flex items-center justify-center',
          'w-full rounded-b-md',
        )}
        onClick={handleSave}>Calcular</button>
        </div>
        <SearchInput 
        value={searchValue} 
        onChange={(v)=> setSearchValue(v)}/>
      </div>
      <h1 className="font-bold text-xl" >You have {eventsMonth.reduce((acc, m) => {
        const l= m.events.length
        return acc+l
      },0)} events in {eventsMonth.length} months</h1>
      <div className="flex flex-row gap-2">
      { 
        visibleMonths.map((month) => (
          <Month key={`${month.year}-${month.month}`} data={month} />
        ))  
      }      
      </div>
    </div>
)
} 



