import { FC, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import deleteSvg from '../../../assets/svg/delete.svg';
import pencilOutlinedSvg from '../../../assets/svg/pencilOutlined.svg';
import replySvg from '../../../assets/svg/reply.svg';
import fileSvg from '../../../assets/svg/file.svg';
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
import { getFileExtension, getFileName, processString, ProcessStringOption } from '../../../utils/stringUtils';
import { FileType, getFileType } from '../../../utils/fileUtils';

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
        const config: ProcessStringOption[] = [
            {
                regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
                fn: (key, result) => (
                    <span key={key}>
                        <a
                            style={{ textDecoration: 'underline' }}
                            target="_blank"
                            href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}
                            rel="noreferrer"
                        >
                            {result[2]}.{result[3]}{result[4]}
                        </a>
                        {result[5]}
                    </span>
                ),
            },
            {
                regex: /(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
                fn: (key, result) => (
                    <span key={key}>
                        <a
                            style={{ textDecoration: 'underline' }}
                            target="_blank"
                            href={`http://${result[1]}.${result[2]}${result[3]}`}
                            rel="noreferrer"
                        >
                            {result[1]}.{result[2]}{result[3]}
                        </a>
                        {result[4]}
                    </span>
                ),
            },
            {
                regex: /(@(\w+))/gim,
                fn: (key, result) => (
                    <Link key={key} to={`/${result[2]}`}>{result[1]}</Link>
                ),
            },
        ];

        const messageText = processString(config)(message.text || '');
        const fileType = message.fileUrl ? getFileType(message.fileUrl) : null;

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
                        <div className={`${s.messageText} textCenter`}>{messageText}</div>
                    </div>
                );
            default:
                return (
                    <div
                        ref={el => {
                            if (!isReadByMe)
                                ref.current = el;
                        }}
                        className={[s.message, isMessageMy ? s.messageMy : null, message.text || fileType === FileType.File ? s.messagePadding : null].join(' ')}
                    >
                        {isFromVisible && (
                            <Link
                                to={`/${message.from?.username}`}
                                className={[s.from, 'bold'].join(' ')}
                                style={{ color: message.from?.avatarColor }}
                            >
                                {message.from?.firstName} {message.from?.lastName}
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
                        {message.fileUrl && renderFile(message.fileUrl, message.text ? null : message.createdAt)}
                        {message.text && <span className={s.messageText}>{messageText}</span>}
                        {(message.text || fileType === FileType.File) && (
                            <span className={s.messageInfo}>
                                {renderMessageInfo()}
                            </span>
                        )}
                    </div>
                );
        }
    };

    const renderMessageInfo = () => {
        return (
            <>
                {message.isEdited &&
                    <span className={'small light'}>edited</span>
                }
                <span className={'small light'}>
                    {getTimeWithoutSeconds(new Date(message.createdAt))}
                </span>
                {isMessageMy && selectedChat?.type !== ChatKind.Saved && <Checks double={!!message.readBy?.length} />}
            </>
        )
    }

    const renderFile = (fileUrl: string, date: string | null = null) => {
        const fileType = getFileType(fileUrl);
        switch (fileType) {
            case FileType.Image:
                return (
                    <div className={s.mediaWrapper}>
                        <img src={fileUrl} alt={fileUrl} className={s.media} />
                        {date && (
                            <div className={s.fileMessageInfo}>{renderMessageInfo()}</div>
                        )}
                    </div>
                )
            case FileType.Video:
                return (
                    <div className={s.mediaWrapper}>
                        <video controls src={fileUrl} className={s.media} />
                        {date && (
                            <div className={s.fileMessageInfo}>{renderMessageInfo()}</div>
                        )}
                    </div>
                )
            default:
                return (
                    <a href={message.fileUrl} target="_blank" rel="noreferrer">
                        <div className={s.file}>
                            <img src={fileSvg} width={25} className={'primaryTextSvg'} alt={'fileSvg'} />
                            <div>{message.fileUrl && getFileName(message.fileUrl)}</div>
                        </div>
                    </a>
                )
        }
    }

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

        if (message.fromId === authedUser?.id)
            items.push({
                content: 'Update',
                icon: <img src={pencilOutlinedSvg} width={15} className={'primaryTextSvg'} alt={'pencilOutlinedSvg'} />,
                onClick: () => setInUpdateMessageHanlder(message.id),
                type: 'default',
            });

        if (selectedChat?.type !== ChatKind.Saved)
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
                                    name={user.fullName}
                                />
                            ),
                        )}
                    </div>
                </div>,
                icon: <Checks double />,
                onClick: () => dispatch(chatActions.setInViewMessageIdReadBy(message.id)),
                type: 'default',
            });

        if (message.fromId === authedUser?.id || selectedChat?.type === ChatKind.Personal)
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