import React, {FC, ReactNode, useEffect, useRef} from 'react';
import {createPortal} from "react-dom";

type Props = {
    children: ReactNode,
    visible: boolean,
};

const modalElement = document.getElementById('modal') as HTMLDivElement;

export const Modal: FC<Props> = ({children, visible = false}) => {
    const headerExtraButtonsElement = useRef(document.createElement('div'))

    useEffect(() => {
        modalElement?.appendChild(headerExtraButtonsElement.current);
        return () => {
            modalElement?.removeChild(headerExtraButtonsElement.current);
        }
    }, [])

    return visible
        ? createPortal(
            children,
            headerExtraButtonsElement.current)
        : null;
};