import React, {FC} from 'react';
import s from './ChatInfo.module.css';
import {Link, useParams} from "react-router-dom";
import {useAppSelector} from "../../../behavior/store";
import {Avatar} from "../../common/Avatar/Avatar";

type Props = {};
export const ChatInfo: FC<Props> = ({}) => {
    const params = useParams();
    const chatId = params.chatId;
    const selectedChat = useAppSelector(s => s.chats.chats.find(c => c.id === chatId));
    const parts = selectedChat?.name?.split(' ')[0] || [];
    const firstName = parts.length ? parts[0] : '';
    const lastName = parts.length > 1 ? parts[1] : '';

    return (
            <div className={s.wrapper}>
                <Link to={''}>
                <div className={s.chatInfo}>
                    <Avatar
                        firstName={firstName}
                        lastName={lastName}
                        backgroundColor={selectedChat?.imageUrl}
                        width={40}
                        height={40}
                    />
                    <div className={'bold'}>{selectedChat?.name}</div>
                </div>
                </Link>
            </div>
    );
};