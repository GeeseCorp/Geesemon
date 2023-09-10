import { useSubscription } from '@apollo/client';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import deleteSvg from '../../../assets/svg/delete.svg';
import pinSvg from '../../../assets/svg/pin.svg';
import notificationOutlinedSvg from '../../../assets/svg/notificationOutlined.svg';
import exitSvg from '../../../assets/svg/exit.svg';
import { Chat as ChatType, chatActions } from '../../../behavior/features/chats';
import { ChatActivityData, ChatActivityVars, ChatMembersData, ChatMembersVars, CHAT_ACTIVITY_SUBSCRIPTIONS, CHAT_MEMBERS_SUBSCRIPTIONS } from '../../../behavior/features/chats/subscriptions';
import { ChatKind, ChatMembersKind, MessageKind } from '../../../behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useSelectedChatIdentifier } from '../../../hooks/useSelectedChat';
import { getTimeWithoutSeconds } from '../../../utils/dateUtils';
import { Avatar } from '../../common/Avatar/Avatar';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import { ContextMenu } from '../../common/ContextMenu/ContextMenu';
import { MenuItem } from '../../common/Menu/Menu';
import { OnlineIndicator } from '../../common/OnlineIndicator/OnlineIndicator';
import s from './Chat.module.scss';
import { Checks } from '../../messages/Checks/Checks';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';
import { formatGeesetext } from '../../../utils/stringUtils';
import { localStorageGetItem } from '../../../utils/localStorageUtils';

type Props = {
    chat: ChatType;
    withSelected?: boolean;
    withMenu?: boolean;
    onClickChat: (chatIdentifier: string) => void;
};

export const Chat: FC<Props> = ({ chat, withSelected = true, withMenu = true, onClickChat }) => {
  const selectedChatIdentifier = useSelectedChatIdentifier();
  const dispatch = useAppDispatch();
  const authedUser = useAppSelector(s => s.auth.authedUser);
  const chatActivity = useSubscription<ChatActivityData, ChatActivityVars>(CHAT_ACTIVITY_SUBSCRIPTIONS, {
    variables: { chatId: chat.id, token: localStorageGetItem('AuthToken') || '' },
  });
  const chatMembers = useSubscription<ChatMembersData, ChatMembersVars>(CHAT_MEMBERS_SUBSCRIPTIONS, {
    variables: { chatId: chat.id, token: localStorageGetItem('AuthToken') || '' },
  });
  const navigate = useNavigate();
  const T = useGeeseTexts();

  const oppositeUser = chat.type === ChatKind.Personal ? chat.users.filter(u => u.id !== authedUser?.id)[0] : null;
  const isOnline = chat.type === ChatKind.Personal && oppositeUser?.isOnline;
  // const lastTimeOnline = chat.type === ChatKind.Personal && oppositeUser?.lastTimeOnline
  const lastMessage = chat.messages?.length ? chat.messages?.reduce((a, b) => a.createdAt > b.createdAt ? a : b, chat.messages[0]) : null;

  const [lastMessageText, setLastMessageText] = useState<string | undefined | null>(lastMessage?.text);

  useEffect(() => {
    if (lastMessage && lastMessage.type === MessageKind.SystemGeeseText && lastMessage.text && T[lastMessage.text]) {
      setLastMessageText(formatGeesetext(T[lastMessage.text!], ...lastMessage.geeseTextArguments));
    }
  }, [T]);

  useEffect(() => {
    const userChat = chatActivity.data?.chatActivity;
    if (userChat) {
      dispatch(chatActions.addOrUpdateUserInChat(userChat));
      dispatch(chatActions.shallowUpdateChat(userChat.chat));
    }
  }, [chatActivity.data?.chatActivity]);

  useEffect(() => {
    if (chatMembers.data?.chatMembers) {
      switch (chatMembers.data.chatMembers.type) {
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
    if (!withMenu)
      return [];

    const items: MenuItem[] = [];

    items.push({
      content: T.Pin,
      icon: <img src={pinSvg} width={20} className={'primaryTextSvg'} alt={'pinSvg'} />,
      onClick: () => { },
      type: 'default',
    });

    items.push({
      content: T.Unmute,
      icon: <img src={notificationOutlinedSvg} width={20} className={'primaryTextSvg'} alt={'notificationOutlinedSvg'} />,
      onClick: () => { },
      type: 'default',
    });

    items.push({
      content: T.LeaveChat,
      icon: <img src={exitSvg} width={20} className={'primaryTextSvg'} alt={'exitSvg'} />,
      onClick: () => {
        dispatch(chatActions.leaveChatAsync({ chatId: chat.id }));
        if (selectedChatIdentifier === chat.identifier)
          navigate('/');
      },
      type: 'default',
    });

    if (chat.creatorId === authedUser?.id || chat.type === ChatKind.Personal)
      items.push({
        content: T.DeleteChat,
        icon: <img src={deleteSvg} width={20} className={'dangerSvg'} alt={'deleteSvg'} />,
        onClick: () => {
          dispatch(chatActions.chatDeleteAsync(chat.id));
          if (selectedChatIdentifier === chat.identifier)
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
      <div
        className={[s.chat, chat.identifier === selectedChatIdentifier && withSelected ? s.chatSelected : null].join(' ')}
        onClick={() => onClickChat(chat.identifier)}
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
                <span className="secondary">{lastMessage?.forwardedMessage ? lastMessage.forwardedMessage.text : lastMessageText}</span>
              </div>
              {!!chat.notReadMessagesCount &&
                                <div className={s.notReadMessagesCount}>{chat.notReadMessagesCount}</div>
              }
            </div>
          </div>

        </div>
      </div>
    </ContextMenu>
  );
};