import React, {FC} from 'react';
import {useAppSelector} from "../../../behavior/store";
import {useParams} from "react-router-dom";
import s from './Messages.module.css';
import {getTimeWithoutSeconds} from "../../../utils/dateUtils";
import {Checks} from "../Checks/Checks";

export const Messages: FC = () => {
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const params = useParams();
    const chatId = params.chatId;
    const messages = useAppSelector(s => s.messages.messages.filter(m => m.chatId === chatId))

    return (
        <div className={s.messages}>
            {messages.map(message => (
                <div
                    key={message.id}
                    className={[s.message, message.fromId === authedUser?.id ? s.messageMy : null].join(' ')}
                >
                    <div>{message.text}</div>
                    {message.createdAt !== message.updatedAt && <div className={['small', s.small].join(' ')}>Edited</div>}
                    <div className={['small', s.small].join(' ')}>{getTimeWithoutSeconds(new Date(message.createdAt))}</div>
                    <Checks double={!!message.readMessages?.length} />
                </div>
            ))}
        </div>
    );
};