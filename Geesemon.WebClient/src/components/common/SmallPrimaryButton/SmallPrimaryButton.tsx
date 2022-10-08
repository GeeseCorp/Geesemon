import React, { FC, MouseEventHandler } from 'react';
import s from './SmallPrimaryButton.module.scss';
import { SmallLoading } from "../SmallLoading/SmallLoading";

type Props = {
    children?: React.ReactNode
    onClick?: MouseEventHandler | undefined
    loading?: boolean
    type?: 'submit' | 'reset' | 'button'
    disabled?: boolean
};

export const SmallPrimaryButton: FC<Props> = ({ children, onClick, loading = false, type = 'button', disabled = false }) => {
    return (
        <button
            disabled={loading || disabled}
            type={type}
            className={[s.smallButton, loading || disabled ? s.disabled : ''].join(' ')}
            onClick={onClick}
        >
            {loading
                ? <SmallLoading />
                : children
            }
        </button>
    );
};