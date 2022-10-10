import { useEffect, useState } from "react"

export const useOnScreen = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    const [isIntersecting, setIntersecting] = useState(false)
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting))
    
    useEffect(() => {
        if (ref.current)
            observer.observe(ref.current)

        return () => {
            if (ref.current)
                observer.disconnect()
        }
    }, [])

    return isIntersecting
}