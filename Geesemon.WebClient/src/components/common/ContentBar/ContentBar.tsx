import React, {FC} from 'react';
import {ChatHeader} from "../../chats/ChatHeader/ChatHeader";
import {Messages} from "../../messages/Messages/Messages";
import s from './ContentBar.module.css';

type Props = {

};
export const ContentBar: FC<Props> = ({}) => {
    return (
        <div className={s.wrapper}>
            <ChatHeader/>
            <Messages/>
        </div>
    );
};