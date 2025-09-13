import { useEffect, useState } from "react"


export const useDebounce = <T>(initialValue: T, delay: number) => {

    const [value, setValue] = useState<T>(initialValue)  // Almacena el valor actual
    const [debouncedValue, setDebouncedValue] = useState<T>(value) // Almacena el valor con debounce

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler) // Limpia el timeout si el componente se desmonta(re-renderizado o cambio de vista) o si el valor cambia antes de que se complete el delay
        }

    }, [value])

    return [debouncedValue, setValue, value] as const 
}
