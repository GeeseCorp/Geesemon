import React, {FC} from 'react';
import {ChatHeader} from "../../chats/ChatHeader/ChatHeader";
import {Messages} from "../../messages/Messages/Messages";
import s from './ContentBar.module.css';
import {useParams} from "react-router-dom";

type Props = {};
export const ContentBar: FC<Props> = ({}) => {
    const params = useParams();
    const chatId = params.chatId;

    return (
        <div className={s.wrapper}>
            {chatId
                ? <>
                    <ChatHeader/>
                    <Messages/>
                </>
                : <div className={'center'}>Select a chat</div>}
        </div>
    );
};