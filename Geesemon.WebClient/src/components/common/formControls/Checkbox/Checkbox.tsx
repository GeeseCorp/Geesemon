import React, { FC } from 'react';
import s from './Checkbox.module.scss';

type Props = {
    checked: boolean;
    setChecked: (checked: boolean) => void;
};

export const Checkbox: FC<Props> = ({ checked, setChecked }) => {
    return (
        <div>
            <input 
              type="checkbox"
              className={s.checkbox}
              checked={checked} 
              onChange={e => setChecked(e.target.checked)}
            />
            {/* <label htmlFor="test1">Red</label> */}
        </div>
    );
};