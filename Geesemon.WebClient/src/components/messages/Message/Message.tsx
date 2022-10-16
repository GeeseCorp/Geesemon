import { FC, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import deleteSvg from '../../../assets/svg/delete.svg';
import pencilOutlinedSvg from '../../../assets/svg/pencilOutlined.svg';
import replySvg from '../../../assets/svg/reply.svg';
import { chatActions } from '../../../behavior/features/chats';
import { ChatKind, Message as MessageType, MessageKind } from '../../../behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useOnScreen } from '../../../hooks/useOnScreen';
import { getTimeWithoutSeconds } from '../../../utils/dateUtils';
import { Avatar } from '../../common/Avatar/Avatar';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import { ContextMenu } from '../../common/ContextMenu/ContextMenu';
import { MenuItem } from '../../common/Menu/Menu';
import { Checks } from '../Checks/Checks';
import s from './Message.module.scss';
import { useSelectedChat } from '../../../hooks/useSelectedChat';
import { Mode } from '../../../behavior/features/chats/slice';

type Props = {
    message: MessageType;
    inputTextFocus?: () => void;
    isFromVisible?: boolean;
};

export const Message: FC<Props> = ({ message, inputTextFocus, isFromVisible = false }) => {
    const messageIdsMakeReadLoading = useAppSelector(s => s.chats.messageIdsMakeReadLoading);
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLDivElement | null>(null);
    const isVisible = useOnScreen(ref);
    const selectedChat = useSelectedChat();

    const isMessageMy = message.fromId === authedUser?.id;
    const isReadByMe = message.readBy.find(u => u.id === authedUser?.id);

    useEffect(() => {
        if (!messageIdsMakeReadLoading.find(mId => mId === message.id) && isVisible && !isReadByMe && !isMessageMy) {
            dispatch(chatActions.addMessageIdMakeReadLoading(message.id));
            dispatch(chatActions.messageMakeReadAsync({ messageId: message.id }));
        }
    }, [isVisible]);

    const messageContent = () => {
        switch (message.type) {
            case MessageKind.System:
                return (
                    <div
                      ref={el => {
                            if (!isReadByMe)
                                ref.current = el;
                        }}
                      className={[s.message, s.messageSystem].join(' ')}
                    >
                        <span className={s.messageText}>{message.text}</span>
                    </div>
                );
            default:
                return (
                    <div
                      ref={el => {
                            if (!isReadByMe)
                                ref.current = el;
                        }}
                      className={[s.message, isMessageMy ? s.messageMy : null].join(' ')}
                    >
                        {isFromVisible && (
                            <Link 
                              to={`/${message.from?.username}`}
                              className={[s.from, 'bold'].join(' ')} 
                              style={{ color: message.from?.avatarColor }}
                            >
                                {message.from?.firstName} {message.from?.firstName}
                            </Link>
                        )}
                        {message.replyMessage && (
                            <div
                              style={{ borderColor: selectedChat?.type === ChatKind.Group ? message.replyMessage.from?.avatarColor : '' }} 
                              className={s.replyMessage}
                            >
                                <div 
                                  style={{ color: selectedChat?.type === ChatKind.Group ? message.replyMessage.from?.avatarColor : '' }} 
                                  className={'small bold primary'}
                                >
                                    {message.replyMessage?.from?.fullName}
                                </div>
                                <div className={['small primary', s.replyMessageText].join(' ')}>{message.replyMessage?.text}</div>
                            </div>
                        )}
                        <span className={s.messageText}>{message.text}</span>
                        <span className={s.messageInfo}>
                            {message.isEdited &&
                                <span className={'small light'}>edited</span>
                            }
                            <span className={'small light'}>
                                {getTimeWithoutSeconds(new Date(message.createdAt))}
                            </span>
                            {isMessageMy && <Checks double={!!message.readBy?.length} />}
                        </span>
                    </div>
                );
        }
    };

    const setInUpdateMessageHanlder = (messageId: string) => {
        dispatch(chatActions.setInUpdateMessageId(messageId));
        dispatch(chatActions.setMode(Mode.Updating));
        inputTextFocus && inputTextFocus();
    };

    const setReplyMessageHanlder = (messageId: string) => {
        dispatch(chatActions.setReplyMessageId(messageId));
        dispatch(chatActions.setMode(Mode.Reply));
        inputTextFocus && inputTextFocus();
    };

    const getContextMenuItems = (): MenuItem[] => {
        const items: MenuItem[] = [{
            content: 'Reply',
            icon: <img src={replySvg} width={17} className={'primaryTextSvg'} alt={'replySvg'} />,
            onClick: () => setReplyMessageHanlder(message.id),
            type: 'default',
        }];

        if(message.fromId === authedUser?.id)
            items.push({
                content: 'Update',
                icon: <img src={pencilOutlinedSvg} width={15} className={'primaryTextSvg'} alt={'pencilOutlinedSvg'} />,
                onClick: () => setInUpdateMessageHanlder(message.id),
                type: 'default',
            });
     
        if(selectedChat?.type !== ChatKind.Saved)
            items.push({
                content: <div className={s.readBy}>
                <div>{message.readByCount} seen</div>
                <div className={s.last3ReadBy}>
                    {message.readBy.slice(0, 3).map(user => user.imageUrl
                        ? (
                            <Avatar
                              key={user.id}
                              width={22}
                              height={22}
                              imageUrl={user.imageUrl}
                            />
                            )
                        : (
                            <AvatarWithoutImage
                              key={user.id}
                              width={22}
                              height={22}
                              fontSize={8}
                              backgroundColor={user.avatarColor}
                              name={`${user.firstName} ${user.lastName}`}
                            />
                        ),
                    )}
                    </div>
                </div>,
                icon: <Checks double />,
                onClick: () => dispatch(chatActions.setInViewMessageIdReadBy(message.id)),
                type: 'default',
            });
    
        if(message.fromId === authedUser?.id || selectedChat?.type === ChatKind.Personal)
            items.push({
                content: 'Delete',
                icon: <img src={deleteSvg} width={20} className={'dangerSvg'} alt={'deleteSvg'} />,
                onClick: () => dispatch(chatActions.messageDeleteAsync({ messageId: message.id })),
                type: 'danger',
            });

        return items;
    };

    return (
        <ContextMenu items={getContextMenuItems()}>
            {messageContent()}
        </ContextMenu>
    );
};