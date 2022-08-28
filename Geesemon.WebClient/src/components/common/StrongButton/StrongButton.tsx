import React, {FC, MouseEventHandler} from 'react';
import s from './StrongButton.module.css';

type Props = {
    children?: React.ReactNode,
    onClick?: MouseEventHandler | undefined;
};

export const StrongButton: FC<Props> = ({children, onClick}) => {
    return (
        <div className={s.strongButton} onClick={onClick}>
            {children}
        </div>
    );
};