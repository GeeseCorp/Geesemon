import React, {FC} from 'react';
import s from './StrongButton.module.css';

type Props = {
    children?: React.ReactNode,
};

export const StrongButton: FC<Props> = ({children}) => {
    return (
        <div className={s.strongButton}>
            {children}
        </div>
    );
};