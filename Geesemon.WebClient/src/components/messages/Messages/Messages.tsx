import React, {FC} from 'react';
import {useAppSelector} from "../../../behavior/store";
import {useParams} from "react-router-dom";
import s from './Messages.module.css';
import {getDayAndMonth, getTimeWithoutSeconds} from "../../../utils/dateUtils";
import {Checks} from "../Checks/Checks";
import {DeleteOutlined} from "@ant-design/icons";
import {ContextMenu} from "../../common/ContextMenu/ContextMenu";
import {SendMessageForm} from "../SendMessageForm/SendMessageForm";

export const Messages: FC = () => {
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const params = useParams();
    const chatId = params.chatId;
    const messages = useAppSelector(s => s.chats.chats.find(c => c.id === chatId)?.messages) || [];

    return (
        <div className={s.wrapperPage}>
            <div className={s.messages}>
                {messages.flatMap((message, i) => {
                    const isMessageMy = message.fromId === authedUser?.id;
                    const returnJsx: React.ReactNode[] = []
                    if (i === 0)
                        returnJsx.push(
                            <div
                                className={[s.message, s.messageSystem].join(' ')}
                            >
                                {getDayAndMonth(new Date(messages[i].createdAt))}
                            </div>
                        )
                    if (i + 1 < messages.length && message.createdAt !== messages[i + 1].createdAt) {
                        returnJsx.push(
                            <div
                                className={[s.message, s.messageSystem].join(' ')}
                            >
                                {getDayAndMonth(new Date(messages[i + 1].createdAt))}
                            </div>
                        )
                    }
                    returnJsx.push(
                        <ContextMenu
                            key={message.id}
                            items={[
                                {
                                    content: 'Delete',
                                    icon: <DeleteOutlined/>,
                                    // onClick: () => dispatch(),
                                    type: 'danger',
                                },
                            ]}
                        >
                            <div
                                className={[s.message, isMessageMy ? s.messageMy : null].join(' ')}
                            >
                                <div>{message.text}</div>
                                {message.createdAt !== message.updatedAt &&
                                    <div className={['small', s.small].join(' ')}>Edited</div>}
                                <div
                                    className={['small', s.small].join(' ')}>{getTimeWithoutSeconds(new Date(message.createdAt))}</div>
                                {isMessageMy && <Checks double={!!message.readMessages?.length}/>}
                            </div>
                        </ContextMenu>
                    )
                    return returnJsx;
                })}
            </div>
            <SendMessageForm/>
        </div>
    );
};