import React, {FC, MouseEventHandler} from 'react';
import s from './Button.module.css';

type Props = {
    children: React.ReactNode,
    onClick?: MouseEventHandler | undefined;
};
export const Button: FC<Props> = ({children, onClick}) => {
    return (
        <div className={s.button} onClick={onClick}>
            {children}
        </div>
    );
};