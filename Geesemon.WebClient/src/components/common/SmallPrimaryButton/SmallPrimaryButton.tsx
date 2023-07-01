import React from 'react';
import s from './SmallPrimaryButton.module.scss';
import { SmallLoading } from '../SmallLoading/SmallLoading';

type Props = {
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onRightClick?: (e: React.MouseEvent<HTMLElement>) => void;
    loading?: boolean;
    type?: 'submit' | 'reset' | 'button';
    disabled?: boolean;
    className?: string;
};

export const SmallPrimaryButton = ({
    children,
    onClick,
    onRightClick,
    loading = false,
    type = 'button',
    disabled = false,
    className,
}: Props) => {
    return (
        <button
            disabled={loading || disabled}
            type={type}
            className={[s.smallButton, loading || disabled ? s.disabled : '', className].join(' ')}
            onClick={onClick}
            onContextMenu={onRightClick}
        >
            {loading
                ? <SmallLoading />
                : children
            }
        </button>
    );
};