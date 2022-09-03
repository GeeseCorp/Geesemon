import {useSearchParams} from "react-router-dom";

export const useLeftSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const leftSidebar = searchParams.get('leftSidebar')
    const setLeftSidebar = (value: string): void => setSearchParams({leftSidebar: value});
    return [leftSidebar, setLeftSidebar];
}