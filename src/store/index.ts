import { create } from 'zustand'
import type { StoreType } from '@/types/store'

const useAppStore = create<StoreType>(
    (set) => (
    {
        role: 'user',
        theme: 'light',
        
        // setTheme: (theme) => set((state => ({...state, theme})))
        // setTheme: (theme) => set({theme}),
        setTheme: (theme) => 
            set((state)=> {
                localStorage.setItem('theme', theme)
                localStorage.setItem('mantine-color-scheme-value', theme)
                if(theme === 'dark'){
                    document.documentElement.classList.add('dark')
                    
                } else {

                    document.documentElement.classList.remove('dark')
                }
                return{
                    ...state,
                    theme: theme,
                }
            }),
        }))
export default useAppStore
