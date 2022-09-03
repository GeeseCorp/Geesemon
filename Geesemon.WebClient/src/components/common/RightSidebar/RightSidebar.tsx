import React, {FC} from 'react';
import s from './RightSidebar.module.css';

type Props = {

};
export const RightSidebar: FC<Props> = ({}) => {
    return (
        <div className={s.wrapper}>
            <div className={['header', s.header].join(' ')}>

            </div>
        </div>
    );
};