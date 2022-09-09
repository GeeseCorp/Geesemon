import React, { FC, MouseEventHandler } from 'react';
import s from './BigPrimaryButton.module.scss';
import { SmallLoading } from "../SmallLoading/SmallLoading";

type Props = {
    children?: React.ReactNode
    onClick?: MouseEventHandler | undefined
    loading?: boolean
};

export const BigStrongButton: FC<Props> = ({ children, onClick, loading = false }) => {
    return (
        <button className={[s.strongButton, loading ? s.disabled : ''].join(' ')} onClick={onClick}>
            {children}
            {loading &&
                <div className={s.loading}>
                    <SmallLoading />
                </div>
            }
        </button>
    );
};