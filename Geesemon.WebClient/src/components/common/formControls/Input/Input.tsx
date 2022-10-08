import { ChangeEventHandler, FC, FocusEventHandler, useState } from 'react';
import s from './Input.module.scss';

type Props = {
    placeholder?: string
    name: string
    value: string
    onChange: ChangeEventHandler
    onFocus?: () => void
    type?: 'text' | 'password'
    onBlur?: FocusEventHandler
    touched?: boolean
    errors?: string
};
export const Input: FC<Props> = ({ placeholder, name, value, onChange, onFocus, type = 'text', onBlur, touched, errors }) => {
    const [inputSearchFocused, setInputSearchFocused] = useState(false);

    const onInputSearchFocus = () => {
        setInputSearchFocused(true)
        onFocus && onFocus();
    }

    const onInputSearchBlur = (e: any) => {
        setInputSearchFocused(false);
        onBlur && onBlur(e);
    }

    return (
        <div className={s.wrapperInput}>
            <div className={[s.innerInput, inputSearchFocused && s.focused].join(' ')}>
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    className={s.input}
                    value={value}
                    onChange={onChange}
                    onFocus={onInputSearchFocus}
                    onBlur={onInputSearchBlur}
                />
            </div>
            {touched && errors && <div className={['small', s.errors].join(' ')}>{errors}</div>}
        </div>
    );
};