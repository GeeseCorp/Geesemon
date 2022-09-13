import React, { FC, HTMLInputTypeAttribute, useState } from 'react';
import s from './Input.module.scss';

type Props = {
    placeholder?: string
    name?: string
    value: string
    setValue: (value: string) => void
    onFocus?: () => void
    type?: 'text' | 'password';
};
export const Input: FC<Props> = ({ placeholder, name, value, setValue, onFocus, type = 'text' }) => {
    const [inputSearchFocused, setInputSearchFocused] = useState(false);

    const onInputSearchFocus = () => {
        setInputSearchFocused(true)
        onFocus && onFocus();
    }

    const onInputSearchBlur = () => {
        setInputSearchFocused(false)
    }

    return (
        <div className={s.wrapperInputSearch}>
            <div className={[s.innerInputSearch, inputSearchFocused && s.focused].join(' ')}>
                <input
                    type={type}
                    value={value}
                    name={name}
                    onChange={e => setValue(e.target.value)}
                    placeholder={placeholder}
                    className={s.inputSearch}
                    onFocus={onInputSearchFocus}
                    onBlur={onInputSearchBlur}
                />
            </div>
        </div>
    );
};