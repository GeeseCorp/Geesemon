import { useSubscription } from '@apollo/client';
import { FC, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import deleteSvg from '../../../assets/svg/delete.svg';
import pinSvg from '../../../assets/svg/pin.svg';
import notificationOutlinedSvg from '../../../assets/svg/notificationOutlined.svg';
import { Chat as ChatType, chatActions } from '../../../behavior/features/chats';
import { ChatActivityData, ChatActivityVars, ChatMembersData, ChatMembersVars, CHAT_ACTIVITY_SUBSCRIPTIONS, CHAT_MEMBERS_SUBSCRIPTIONS } from '../../../behavior/features/chats/subscriptions';
import { ChatKind, ChatMembersKind } from '../../../behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useSelectedChatUsername } from '../../../hooks/useSelectedChat';
import { getTimeWithoutSeconds } from '../../../utils/dateUtils';
import { getAuthToken } from '../../../utils/localStorageUtils';
import { Avatar } from '../../common/Avatar/Avatar';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import { ContextMenu } from '../../common/ContextMenu/ContextMenu';
import { MenuItem } from '../../common/Menu/Menu';
import { OnlineIndicator } from '../../common/OnlineIndicator/OnlineIndicator';
import s from './Chat.module.scss';
import { Checks } from '../../messages/Checks/Checks';

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
    const chatMembers = useSubscription<ChatMembersData, ChatMembersVars>(CHAT_MEMBERS_SUBSCRIPTIONS, {
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
            dispatch(chatActions.addOrUpdateUserInChat(userChat));
            dispatch(chatActions.shallowUpdateChat(userChat.chat));
        }
    }, [chatActivity.data?.chatActivity]);

    useEffect(() => {
        if (chatMembers.data?.chatMembers) {
            switch(chatMembers.data.chatMembers.type){
                case ChatMembersKind.Add:
                    dispatch(chatActions.chatAddMembers({ chatId: chat.id, members: [chatMembers.data.chatMembers.user] }));
                break;
                case ChatMembersKind.Delete:
                    dispatch(chatActions.chatRemoveMembers({ chatId: chat.id, members: [chatMembers.data.chatMembers.user] }));
                break;
            }
        }
    }, [chatMembers.data?.chatMembers]);

    const getContextMenuItems = (): MenuItem[] => {
        const items: MenuItem[] = [];

        items.push({
            content: 'Pin',
            icon: <img src={pinSvg} width={20} className={'primaryTextSvg'} alt={'pinSvg'} />,
            onClick: () => {},
            type: 'default',
        });

        items.push({
            content: 'Unmute',
            icon: <img src={notificationOutlinedSvg} width={20} className={'primaryTextSvg'} alt={'notificationOutlinedSvg'} />,
            onClick: () => {},
            type: 'default',
        });

        if(chat.creatorId === authedUser?.id || chat.type === ChatKind.Personal)
            items.push({
                content: 'Delete chat',
                icon: <img src={deleteSvg} width={20} className={'dangerSvg'} alt={'deleteSvg'} />,
                onClick: () => {
                    dispatch(chatActions.chatDeleteAsync(chat.id));
                    if(selectedChatUsername === chat.username)
                        navigate('/');
                },
                type: 'danger',
            });
        return items;
    }; 

    return (
        <ContextMenu
          key={chat.id}
          items={getContextMenuItems()}
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
                                <div className={s.timeAndChecks}>
                                    {lastMessage?.fromId === authedUser?.id && <Checks double={!!lastMessage?.readBy?.length} />}
                                    <span className={'small light'}>{lastMessage && getTimeWithoutSeconds(new Date(lastMessage.createdAt))}</span>
                                </div>
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