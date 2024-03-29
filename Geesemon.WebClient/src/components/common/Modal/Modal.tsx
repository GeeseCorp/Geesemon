import { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.scss';

type Props = {
  children: ReactNode;
  opened?: boolean;
} & JSX.IntrinsicElements['div'];

const modalElement = document.getElementById('modal') as HTMLDivElement;
const rootElement = document.getElementById('root') as HTMLDivElement;

export const Modal: FC<Props> = ({ children, opened, className, ...rest }) => {
  const modalRef = useRef(document.createElement('div'));

  useEffect(() => {
    modalElement?.appendChild(modalRef.current);
    return () => {
      modalElement?.removeChild(modalRef.current);
      rootElement.className = '';
    };
  }, []);

  useEffect(() => {
    if (opened)
      rootElement.classList.add(s.modalOpened);
    else
      rootElement.classList.remove(s.modalOpened);
  }, [opened]);

  // rootElement.style.pointerEvents = opened ? 'none' : 'auto'

  return opened
    ? createPortal(
      <div className={`${s.innerModel} ${className}`} {...rest}>
        {children}
      </div>,
      modalRef.current)
    : null;
};
