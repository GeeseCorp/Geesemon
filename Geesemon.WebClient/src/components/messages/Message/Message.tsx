import s from './Message.module.scss';
import { FC, memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import fileSvg from '../../../assets/svg/file.svg';
import { chatActions } from '../../../behavior/features/chats';
import { ChatKind, Message, MessageKind, MediaKind, ForwardedMessage } from '../../../behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useOnScreen } from '../../../hooks/useOnScreen';
import { getTimeWithoutSeconds } from '../../../utils/dateUtils';
import { Checks } from '../Checks/Checks';
import { useSelectedChat } from '../../../hooks/useSelectedChat';
import { Mode } from '../../../behavior/features/chats/slice';
import { format, getFileName, processString, ProcessStringOption } from '../../../utils/stringUtils';
import { FileType, getFileType } from '../../../utils/fileUtils';
import { Checkbox } from '../../common/formControls/Checkbox/Checkbox';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';
import { VoiceMessage } from './VoiceMessage';
import { ProcessStringOption, identifierProcessStringOption, linkProcessStringOption, processString } from '../../../utils/processString';
import { MessageContextMenu } from './MessageContextMenu';

type Props = {
    message: Message;
    inputTextFocus?: () => void;
    isFromVisible?: boolean;
};

export const MessageItem: FC<Props> = memo(({ message, inputTextFocus, isFromVisible = false }) => {
    const selectedMessageIds = useAppSelector(s => s.chats.selectedMessageIds);
    const messageIdsMakeReadLoading = useAppSelector(s => s.chats.messageIdsMakeReadLoading);
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLDivElement | null>(null);
    const isVisible = useOnScreen(ref);
    const selectedChat = useSelectedChat();
    const [text, setText] = useState<string | undefined | null>('');

    const isMessageMy = message.fromId === authedUser?.id;
    const isReadByMe = message.readBy.find(u => u.id === authedUser?.id);

    const T = useGeeseTexts();

    useEffect(() => {
        if(message.type === MessageKind.SystemGeeseText && message.text && T[message.text])
        {
            setText(format(T[message.text!], ...message.geeseTextArguments));
        }
    }, [T]);

    useEffect(() => {
        if (!messageIdsMakeReadLoading.find(mId => mId === message.id) && isVisible && !isReadByMe && !isMessageMy) {
            dispatch(chatActions.addMessageIdMakeReadLoading(message.id));
            dispatch(chatActions.messageMakeReadAsync({ messageId: message.id }));
        }
    }, [isVisible]);

    const messageContent = () => {
        const config: ProcessStringOption[] = [
            ...linkProcessStringOption,
            identifierProcessStringOption,
        ];

        const messageText = processString(config)(text ? text : message.text || '');
        const fileType = message.fileUrl ? getFileType(message.fileUrl) : null;

        switch (message.type) {
            case MessageKind.SystemGeeseText:
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
                if (message.forwardedMessage) {
                    const forwardedMessageText = processString(config)(message.forwardedMessage?.text || '');
                    const forwardedMessageFileType = message.forwardedMessage.fileUrl ? getFileType(message.forwardedMessage.fileUrl) : null;
                    return (
                        <div
                            ref={el => {
                                if (!isReadByMe)
                                    ref.current = el;
                            }}
                            className={[s.message, isMessageMy ? s.messageMy : null, message.forwardedMessage.text || fileType === FileType.File ? s.messagePadding : null].join(' ')}
                        >
                            <Link
                                to={`/${message.from?.identifier}`}
                                className={[s.from, 'bold', message.forwardedMessage && message.forwardedMessage.fileUrl && s.messagePadding].join(' ')}
                                style={{ color: message.from?.avatarColor }}
                            >
                                {format(T.ForwardedFrom, message.forwardedMessage.from?.fullName)}
                            </Link>
                            {renderFile(message.forwardedMessage, message.forwardedMessage.text ? null : message.createdAt)}
                            {message.forwardedMessage.text && <span className={s.messageText}>{forwardedMessageText}</span>}
                            {(message.forwardedMessage.text || forwardedMessageFileType === FileType.File) && (
                                <span className={s.messageInfo}>
                                    {renderMessageInfo()}
                                </span>
                            )}
                        </div>
                    );
                }
                else {
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
                                    to={`/${message.from?.identifier}`}
                                    className={[s.from, 'bold'].join(' ')}
                                    style={{ color: message.from?.avatarColor }}
                                >
                                    {message.from?.fullName}
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
                            {renderFile(message, message.text ? null : message.createdAt)}
                            {message.text && <span className={s.messageText}>{messageText}</span>}
                            {(message.text || fileType === FileType.File) && (
                                <span className={s.messageInfo}>
                                    {renderMessageInfo()}
                                </span>
                            )}
                        </div>
                    );
                }
        }
    };

    const renderMessageInfo = () => {
        return (
            <>
                {message.isEdited &&
                    <span className={'small light'}>{T.Edited}</span>
                }
                <span className={'small light'}>
                    {getTimeWithoutSeconds(new Date(message.createdAt))}
                </span>
                {isMessageMy && selectedChat?.type !== ChatKind.Saved && <Checks double={!!message.readBy?.length} />}
            </>
        );
    };

    const renderFile = (message: Message | ForwardedMessage, date: string | null = null) => {
        const url = message.fileUrl;
        if (!url)
            return null;

        switch (message.mediaKind) {
            case MediaKind.Voice:
                return <VoiceMessage url={url} />;
        }

        const fileType = getFileType(url);
        switch (fileType) {
            case FileType.Image:
                return (
                    <div className={s.mediaWrapper}>
                        <img src={url} alt={url} className={s.media} />
                        {date && (
                            <div className={s.fileMessageInfo}>{renderMessageInfo()}</div>
                        )}
                    </div>
                );
            case FileType.Video:
                return (
                    <div className={s.mediaWrapper}>
                        <video controls src={url} className={s.media} />
                        {date && (
                            <div className={s.fileMessageInfo}>{renderMessageInfo()}</div>
                        )}
                    </div>
                );
            default:
                return (
                    <a href={url} target="_blank" rel="noreferrer">
                        <div className={s.file}>
                            <img src={fileSvg} width={25} className={'primaryTextSvg'} alt={'fileSvg'} />
                            <div>{getFileName(url)}</div>
                        </div>
                    </a>
                );
        }
    };

    const selectionChange = (checked?: boolean) => {
        if (checked === undefined) {
            checked = !selectedMessageIds.find(id => message.id === id);
        }

        let newSelectedMessageIds = [];

        if (checked) {
            newSelectedMessageIds = [...selectedMessageIds, message.id];
        }
        else {
            newSelectedMessageIds = selectedMessageIds.filter(id => message.id !== id);
        }
        dispatch(chatActions.setSelectedMessageIds(newSelectedMessageIds));

    };

    return (
        <MessageContextMenu message={message} inputTextFocus={inputTextFocus}>
            <div className={s.wrapperMessage} onClick={() => selectedMessageIds.length && selectionChange()}>
                {selectedMessageIds.length > 0 && (
                    <Checkbox
                        checked={!!selectedMessageIds.find(id => message.id === id)}
                        setChecked={checked => selectionChange(checked)}
                    />
                )}
                <div className={s.messageContent}>{messageContent()}</div>
            </div>
        </MessageContextMenu>
    );
});