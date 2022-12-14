import { useEffect, useState } from 'react';

export const useOnScreen = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    const [isIntersecting, setIntersecting] = useState(false);
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (isMounted){
            observer.disconnect();
            if (ref.current)
                observer.observe(ref.current);
        }

        if (!isMounted){
            if (ref.current)
                observer.observe(ref.current);
            setIsMounted(true);
        }

        return () => {
            if (ref.current)
                observer.disconnect();
        };
    }, [isMounted, observer, ref]);

    return isIntersecting;
};