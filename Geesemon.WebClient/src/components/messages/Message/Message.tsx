import styles from './Message.module.scss';
import { FC, memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import fileSvg from '../../../assets/svg/file.svg';
import { chatActions } from '../../../behavior/features/chats';
import { ChatKind, Message, MessageKind, MediaKind, ForwardedMessage } from '../../../behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useOnScreen } from '../../../hooks/useOnScreen';
import { useSelectedChat } from '../../../hooks/useSelectedChat';
import { formatGeesetext, getFileName } from '../../../utils/stringUtils';
import { FileType, getFileType } from '../../../utils/fileUtils';
import { Checkbox } from '../../common/formControls/Checkbox/Checkbox';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';
import { VoiceMessage } from './VoiceMessage';
import { ProcessStringOption, identifierProcessStringOption, linkProcessStringOption, processString } from '../../../utils/processString';
import { MessageContextMenu } from './MessageContextMenu';
import { RoundVideoMessage } from './RoundVideoMessage';
import { MessageAdditionalInfo } from './MessageAdditionalInfo';

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
    if (message.type === MessageKind.SystemGeeseText && message.text && T[message.text]) {
      setText(formatGeesetext(T[message.text!], ...message.geeseTextArguments));
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
            className={[styles.message, styles.messageSystem].join(' ')}
          >
            <div className={`${styles.messageText} textCenter`}>{messageText}</div>
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
              className={[styles.message, isMessageMy ? styles.messageMy : '', message.forwardedMessage.text || fileType === FileType.File ? styles.messagePadding : ''].join(' ')}
            >
              <Link
                to={`/${message.forwardedMessage.from?.identifier}`}
                className={[styles.from, 'bold', message.forwardedMessage && message.forwardedMessage.fileUrl && styles.messagePadding].join(' ')}
                style={{ color: message.from?.avatarColor }}
              >
                {formatGeesetext(T.ForwardedFrom, message.forwardedMessage.from?.fullName)}
              </Link>
              {renderFile(message.forwardedMessage, message.forwardedMessage.text ? null : message.createdAt)}
              {message.forwardedMessage.text && <span className={styles.messageText}>{forwardedMessageText}</span>}
              {(message.forwardedMessage.text || forwardedMessageFileType === FileType.File) && (
                <span className={styles.messageInfo}>
                  <MessageAdditionalInfo message={message} isMessageMy={isMessageMy} />
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
              className={`
                                ${styles.message} ${isMessageMy ? styles.messageMy : ''} 
                                ${message.text || fileType === FileType.File ? styles.messagePadding : null} 
                                ${message.mediaKind === MediaKind.Video ? styles.noBackground : ''}
                            `}
            >
              {isFromVisible && (
                <Link
                  to={`/${message.from?.identifier}`}
                  className={[styles.from, 'bold'].join(' ')}
                  style={{ color: message.from?.avatarColor }}
                >
                  {message.from?.fullName}
                </Link>
              )}
              {message.replyMessage && (
                <div
                  style={{ borderColor: selectedChat?.type === ChatKind.Group ? message.replyMessage.from?.avatarColor : '' }}
                  className={styles.replyMessage}
                >
                  <div
                    style={{ color: selectedChat?.type === ChatKind.Group ? message.replyMessage.from?.avatarColor : '' }}
                    className={'small bold primary'}
                  >
                    {message.replyMessage?.from?.fullName}
                  </div>
                  <div className={['small primary', styles.replyMessageText].join(' ')}>{message.replyMessage?.text}</div>
                </div>
              )}
              {renderFile(message, message.text ? null : message.createdAt)}
              {message.text && <span className={styles.messageText}>{messageText}</span>}
              {(message.text || fileType === FileType.File) && message.mediaKind !== MediaKind.Video && (
                <span className={styles.messageInfo}>
                  <MessageAdditionalInfo message={message} isMessageMy={isMessageMy} />
                </span>
              )}
            </div>
          );
        }
    }
  };

  const renderFile = (m: Message | ForwardedMessage, date: string | null = null) => {
    const url = m.fileUrl;
    if (!url)
      return null;

    switch (m.mediaKind) {
      case MediaKind.Voice:
        return <VoiceMessage message={message} />;
      case MediaKind.Video:
        return <RoundVideoMessage message={message} isMessageMy={isMessageMy} />;
    }

    const fileType = getFileType(url);
    switch (fileType) {
      case FileType.Image:
        return (
          <div className={styles.mediaWrapper}>
            <img src={url} alt={url} className={styles.media} />
            {date && (
              <div className={styles.fileMessageInfo}>
                <MessageAdditionalInfo message={message} isMessageMy={isMessageMy} />
              </div>
            )}
          </div>
        );
      case FileType.Video:
        return (
          <div className={styles.mediaWrapper}>
            <video controls src={url} className={styles.media} />
            {date && (
              <div className={styles.fileMessageInfo}>
                <MessageAdditionalInfo message={message} isMessageMy={isMessageMy} />
              </div>
            )}
          </div>
        );
      default:
        return (
          <a href={url} target="_blank" rel="noreferrer">
            <div className={styles.file}>
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
      <div className={styles.wrapperMessage} onClick={() => selectedMessageIds.length && selectionChange()}>
        {selectedMessageIds.length > 0 && (
          <Checkbox
            checked={!!selectedMessageIds.find(id => message.id === id)}
            setChecked={checked => selectionChange(checked)}
          />
        )}
        <div className={styles.messageContent}>{messageContent()}</div>
      </div>
    </MessageContextMenu>
  );
});
