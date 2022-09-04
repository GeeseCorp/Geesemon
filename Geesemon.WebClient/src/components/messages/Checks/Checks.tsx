import React, {FC} from 'react';
import s from './Checks.module.css';
import check from '../../../assets/svg/check.svg';

type Props = {
    double?: boolean
};
export const Checks: FC<Props> = ({double = false}) => {
    return (
        <div className={s.checks}>
            <img src={check} className={[s.check, s.checkLeft].join(' ')}/>
            {double && <img src={check} className={[s.check, s.checkRight].join(' ')}/>}
        </div>
    );
};