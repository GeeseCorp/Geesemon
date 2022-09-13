import React, { FC, HTMLInputTypeAttribute, useState } from 'react';
import s from './Input.module.scss';

type Props = {
    placeholder?: string
    value: string
    setValue: (value: string) => void
    onFocus?: () => void
    type?: HTMLInputTypeAttribute;
};
export const Input: FC<Props> = ({ placeholder, value, setValue, onFocus, type = 'text' }) => {
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