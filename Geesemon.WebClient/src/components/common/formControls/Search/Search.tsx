import React, { FC, useState } from 'react';
import s from './Search.module.scss';
import searchSvg from '../../../../assets/svg/search.svg';

type Props = {
    onFocus?: () => void;
    placeholder?: string;
    value: string;
    setValue: (value: string) => void;
};
export const Search: FC<Props> = ({ onFocus, placeholder = 'Search', value, setValue }) => {
    const [inputSearchFocused, setInputSearchFocused] = useState(false);

    const onInputSearchFocus = () => {
        setInputSearchFocused(true);
        onFocus && onFocus();
    };

    const onInputSearchBlur = () => {
        setInputSearchFocused(false);
    };

    return (
        <div className={[s.wrapperInputSearch, inputSearchFocused && s.focused].join(' ')}>
            <img src={searchSvg} width={20} className={inputSearchFocused ? 'primarySvg' : 'secondaryTextSvg'} alt={'searchSvg'} />
            <input
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={placeholder}
              className={s.inputSearch}
              onFocus={onInputSearchFocus}
              onBlur={onInputSearchBlur}
            />
        </div>
    );
};