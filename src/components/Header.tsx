import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useMantineColorScheme } from '@mantine/core'
import useAppStore from '@/store'
import { cn } from '@/lib/utils'

export default function Header() {

  const {colorScheme, setColorScheme} = useMantineColorScheme()
  console.log(colorScheme)
  const { theme, setTheme} = useAppStore()

  useEffect(() => {
    console.log("useeffect Header")
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
        setTheme(savedTheme === 'light' ? 'light' : 'dark')
        setColorScheme(savedTheme === 'light' ? 'light' : 'dark')
  },[])
  
  return (
    <header className=" p-2 flex gap-2 bg-zinc-50 text-black justify-between dark:bg-zinc-900">
      <nav className="m-2 flex flex-row">
        <div className="px-2 font-bold dark:text-white">
          <Link to="/flow-balance">Walletfy</Link>
        </div>
        <div className="px-2 font-bold dark:text-white">
          <Link
            to="/form/$id"
            params={{id: 'new'}}
          >
            Add event
          </Link>
        </div>
      </nav>
      <button
        className={cn(
        'rounded-full w-10 h-10 flex justify-center items-center text-xl transition-colors duration-200 ease-in-out cursor-pointer',
        'bg-slate-900 text-white dark:bg-yellow-100 dark:text-slate-900'
        )}
        onClick={()=>{
          setTheme(theme === 'light' ? 'dark' : 'light')
          
          setColorScheme(theme === 'light' ? 'dark' : 'light')
          
        }}
        >
          {theme === 'light' ? '🌙' : '☀️'}

        </button>
    </header>
  )
}
