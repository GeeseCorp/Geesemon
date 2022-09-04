import React, {FC} from 'react';
import s from './Input.module.css';

type Props = {
    placeholder?: string
    name?: string
    value?: string,
    setValue?: (value: string) => void
};
export const Input: FC<Props> = ({placeholder, name, value, setValue}) => {
    return (
        <div className={s.wrapperInput}>
            <input
                type="text"
                placeholder={''}
                name={name}
                id={name}
                value={value}
                onChange={e => setValue && setValue(e.target.value)}
            />
            <label htmlFor={name}>{placeholder}</label>
        </div>
    );
};