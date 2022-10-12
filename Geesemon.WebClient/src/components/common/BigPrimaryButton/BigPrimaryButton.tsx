import React, { FC, MouseEventHandler } from 'react';
import s from './BigPrimaryButton.module.scss';
import { SmallLoading } from '../SmallLoading/SmallLoading';

type Props = {
    children?: React.ReactNode;
    onClick?: MouseEventHandler | undefined;
    loading?: boolean;
    type?: 'submit' | 'reset' | 'button';
    disabled?: boolean;
};

export const BigPrimaryButton: FC<Props> = ({ children, onClick, loading = false, type = 'button', disabled = false }) => {
    return (
        <button
          disabled={loading || disabled}
          type={type}
          className={[s.strongButton, loading || disabled ? s.disabled : ''].join(' ')}
          onClick={onClick}
        >
            {children}
            {loading &&
                <div className={s.loading}>
                    <SmallLoading />
                </div>
            }
        </button>
    );
};