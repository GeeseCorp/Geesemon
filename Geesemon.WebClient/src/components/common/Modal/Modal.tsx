import React, {FC, ReactNode, useEffect, useRef} from 'react';
import {createPortal} from "react-dom";
import s from './Modal.module.scss';

type Props = {
    children: ReactNode,
    opened: boolean,
};

const modalElement = document.getElementById('modal') as HTMLDivElement;
const rootElement = document.getElementById('root') as HTMLDivElement;

export const Modal: FC<Props> = ({children, opened = false}) => {
    const modalRef = useRef(document.createElement('div'))

    useEffect(() => {
        modalElement?.appendChild(modalRef.current);
        return () => {
            modalElement?.removeChild(modalRef.current);
            rootElement.className = '';
        }
    }, [])

    rootElement.className = opened ? s.modalOpened : ''
    // rootElement.style.pointerEvents = opened ? 'none' : 'auto'

    return opened
        ? createPortal(
            <div className={s.innerModel}>{children}</div>,
            modalRef.current)
        : null;
};