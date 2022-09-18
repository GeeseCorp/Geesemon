import React, { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { Chat as ChatType, chatActions } from '../../../behavior/features/chats';
import { getTimeWithoutSeconds } from "../../../utils/dateUtils";
import { Avatar } from "../../common/Avatar/Avatar";
import { AvatarWithoutImage } from "../../common/AvatarWithoutImage/AvatarWithoutImage";
import { ContextMenu } from "../../common/ContextMenu/ContextMenu";
import s from './Chat.module.scss';
import { useAppDispatch } from '../../../behavior/store';
import deleteSvg from "../../../assets/svg/delete.svg";
import { useSubscription } from '@apollo/client';
import { ChatActivityData, ChatActivityVars, CHAT_ACTIVITY_SUBSCRIPTIONS } from '../../../behavior/features/chats/subscriptions';

type Props = {
    chat: ChatType
}

export const Chat: FC<Props> = ({ chat }) => {
    const params = useParams()
    const selectedChatId = params.chatId as string;
    const dispatch = useAppDispatch();
    const chatActivity = useSubscription<ChatActivityData, ChatActivityVars>(CHAT_ACTIVITY_SUBSCRIPTIONS, {
        variables: { chatId: chat.id }
    });

    const lastMessage = chat.messages?.length ? chat.messages?.reduce((a, b) => a.createdAt > b.createdAt ? a : b, chat.messages[0]) : null;

    return (
        <ContextMenu
            key={chat.id}
            items={[
                {
                    content: 'Delete chat',
                    icon: <img src={deleteSvg} width={20} />,
                    onClick: () => dispatch(chatActions.chatDeleteAsync(chat.id)),
                    type: 'danger',
                },
            ]}
        >
            <div className={[s.chat, chat.id === selectedChatId ? s.chatSelected : null].join(' ')}>
                <Link
                    to={`/${chat.id}`}
                    className={s.chatLink}
                >
                    <div className={s.chatInner}>
                        <div className={s.avatar}>
                            {chat.imageUrl
                                ? <Avatar imageUrl={chat.imageUrl} width={54} height={54} />
                                : <AvatarWithoutImage
                                    name={chat.name || ''}
                                    backgroundColor={chat.imageColor}
                                    width={54}
                                    height={54}
                                />
                            }
                            {chatActivity.data?.chatActivity &&
                                <div className={s.onlineIndicator} />
                            }
                        </div>
                        <div className={s.chatInfo}>
                            <div className={'bold'}>{chat.name}</div>
                            <div
                                className={['secondary light', s.chatLastMessage].join(' ')}>{lastMessage?.text}</div>
                        </div>
                        <div
                            className={'small light'}>{lastMessage && getTimeWithoutSeconds(new Date(lastMessage.createdAt))}</div>
                    </div>
                </Link>
            </div >
        </ContextMenu >
    )
}