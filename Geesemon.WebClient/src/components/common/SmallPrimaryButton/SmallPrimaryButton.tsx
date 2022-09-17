import React, {FC, MouseEventHandler} from 'react';
import s from './SmallPrimaryButton.module.scss';
import {SmallLoading} from "../SmallLoading/SmallLoading";

type Props = {
    children?: React.ReactNode
    onClick?: MouseEventHandler | undefined
    loading?: boolean
};

export const SmallPrimaryButton: FC<Props> = ({children, onClick, loading = false}) => {
    return (
        <div className={[s.strongButton, loading ? s.disabled : ''].join(' ')} onClick={onClick}>
            {loading
                ? <SmallLoading/>
                : children
            }
        </div>
    );
};