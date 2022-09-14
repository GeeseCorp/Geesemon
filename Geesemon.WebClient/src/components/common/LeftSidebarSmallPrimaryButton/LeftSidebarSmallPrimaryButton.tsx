import { FC, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { getLeftSidebarSmallPrimaryButtonElement } from "../LeftSidebar/LeftSidebar"

type Props = {
    children: React.ReactNode
}

export const LeftSidebarSmallPrimaryButton: FC<Props> = ({children}) => {
    const leftSidebarSmallPrimaryButtonElement = useRef(document.createElement('div'))
    
    useEffect(() => {
        getLeftSidebarSmallPrimaryButtonElement()?.appendChild(leftSidebarSmallPrimaryButtonElement.current);
        return () => {
            getLeftSidebarSmallPrimaryButtonElement()?.removeChild(leftSidebarSmallPrimaryButtonElement.current);
        }
    }, [])

    return createPortal(
        children,
        leftSidebarSmallPrimaryButtonElement.current);
}