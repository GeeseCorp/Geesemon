import React, { FC, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Chat as ChatType, chatActions } from '../../../behavior/features/chats';
import { getTimeWithoutSeconds } from '../../../utils/dateUtils';
import { Avatar } from '../../common/Avatar/Avatar';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import { ContextMenu } from '../../common/ContextMenu/ContextMenu';
import s from './Chat.module.scss';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import deleteSvg from '../../../assets/svg/delete.svg';
import { useSubscription } from '@apollo/client';
import { ChatActivityData, ChatActivityVars, CHAT_ACTIVITY_SUBSCRIPTIONS } from '../../../behavior/features/chats/subscriptions';
import { ChatKind } from '../../../behavior/features/chats/types';
import { OnlineIndicator } from '../../common/OnlineIndicator/OnlineIndicator';
import { getAuthToken } from '../../../utils/localStorageUtils';
import { useSelectedChatUsername } from '../../../hooks/useSelectedChat';

type Props = {
    chat: ChatType;
};

export const Chat: FC<Props> = ({ chat }) => {
    const selectedChatUsername = useSelectedChatUsername();
    const dispatch = useAppDispatch();
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const chatActivity = useSubscription<ChatActivityData, ChatActivityVars>(CHAT_ACTIVITY_SUBSCRIPTIONS, {
        variables: { chatId: chat.id, token: getAuthToken() || '' },
    });
    const navigate = useNavigate();

    const oppositeUser = chat.type === ChatKind.Personal ? chat.users.filter(u => u.id !== authedUser?.id)[0] : null;
    const isOnline = chat.type === ChatKind.Personal && oppositeUser?.isOnline;
    // const lastTimeOnline = chat.type === ChatKind.Personal && oppositeUser?.lastTimeOnline
    const lastMessage = chat.messages?.length ? chat.messages?.reduce((a, b) => a.createdAt > b.createdAt ? a : b, chat.messages[0]) : null;

    useEffect(() => {
        const userChat = chatActivity.data?.chatActivity;
        if (userChat) {
            dispatch(chatActions.updateUserInChat(userChat));
            dispatch(chatActions.shallowUpdateChat(userChat.chat));
        }
    }, [chatActivity.data?.chatActivity]);

    return (
        <ContextMenu
          key={chat.id}
          items={[
                {
                    content: 'Delete chat',
                    icon: <img src={deleteSvg} width={20} className={'dangerSvg'} alt={'deleteSvg'} />,
                    onClick: () => {
                        dispatch(chatActions.chatDeleteAsync(chat.id));
                        if(selectedChatUsername === chat.username)
                            navigate('/');
                    },
                    type: 'danger',
                },
            ]}
        >
            <div className={[s.chat, chat.username === selectedChatUsername ? s.chatSelected : null].join(' ')}>
                <Link
                  to={`/${chat.username}`}
                  className={s.chatLink}
                >
                    <div className={s.chatInner}>
                        <div className={s.avatar}>
                            {chat.imageUrl
                                ? <Avatar imageUrl={chat.imageUrl} width={54} height={54} />
                                : (
                                    <AvatarWithoutImage
                                      name={chat.name || ''}
                                      backgroundColor={chat.imageColor}
                                      width={54}
                                      height={54}
                                    />
                                )
                            }
                            {isOnline && <OnlineIndicator right={1} bottom={1} />}
                        </div>
                        <div className={s.chatInfo}>
                            <div className={s.chatTitle}>
                                <div className={['bold', s.name].join(' ')}>{chat.name}</div>
                                <div className={'small light'}>{lastMessage && getTimeWithoutSeconds(new Date(lastMessage.createdAt))}</div>
                            </div>
                            <div className={s.chatSubtitle}>
                                <div className={s.chatLastMessage}>
                                    {chat.type === ChatKind.Group
                                        && lastMessage?.fromId
                                        && lastMessage?.fromId !== authedUser?.id 
                                        && <span>{lastMessage?.from?.firstName}: </span>
                                    }
                                    <span className="secondary">{lastMessage?.text}</span>
                                </div>
                                {!!chat.notReadMessagesCount && 
                                    <div className={s.notReadMessagesCount}>{chat.notReadMessagesCount}</div>
                                }
                            </div>
                        </div>

                    </div>
                </Link>
            </div>
        </ContextMenu>
    );
};