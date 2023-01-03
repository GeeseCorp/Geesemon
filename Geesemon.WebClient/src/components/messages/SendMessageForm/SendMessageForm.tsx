import styles from './SendMessageForm.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, KeyboardEvent, MutableRefObject, useEffect, useState } from 'react';
import checkSvg from '../../../assets/svg/check.svg';
import clipSvg from '../../../assets/svg/clip.svg';
import crossFilledSvg from '../../../assets/svg/crossFilled.svg';
import microphoneSvg from '../../../assets/svg/microphone.svg';
import pencilOutlinedSvg from '../../../assets/svg/pencilOutlined.svg';
import sendSvg from '../../../assets/svg/send.svg';
import smileSvg from '../../../assets/svg/smile.svg';
import replySvg from '../../../assets/svg/reply.svg';
import fileSvg from '../../../assets/svg/file.svg';
import { chatActions } from '../../../behavior/features/chats';
import { Mode } from '../../../behavior/features/chats/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useSelectedChat } from '../../../hooks/useSelectedChat';
import { SmallPrimaryButton } from '../../common/SmallPrimaryButton/SmallPrimaryButton';
import { InputFile } from '../../common/formControls/InputFile/InputFile';
import { FileType, getFileType } from '../../../utils/fileUtils';
import { getFileName } from '../../../utils/stringUtils';
import EmojiPicker, { Theme } from 'emoji-picker-react';

const INPUT_TEXT_DEFAULT_HEIGHT = '25px';

type Props = {
    scrollToBottom: () => void;
    inputTextRef: MutableRefObject<HTMLTextAreaElement | null>;
};

export const SendMessageForm: FC<Props> = ({ scrollToBottom, inputTextRef }) => {
    const mode = useAppSelector(s => s.chats.mode);
    const inUpdateMessageId = useAppSelector(s => s.chats.inUpdateMessageId);
    const replyMessageId = useAppSelector(s => s.chats.replyMessageId);
    const [messageText, setMessageText] = useState('');
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const dispatch = useAppDispatch();
    const selectedChat = useSelectedChat();
    const messages = selectedChat?.messages || [];
    const inUpdateMessage = messages.find(m => m.id === inUpdateMessageId);
    const replyMessage = messages.find(m => m.id === replyMessageId);
    const [files, setFiles] = useState<File[]>([]);
    const forwardMessages = useAppSelector(s => s.chats.forwardMessages);

    useEffect(() => {
        if (inUpdateMessageId && inUpdateMessage) {
            setNewMessageText(inUpdateMessage.text || '');
        }
    }, [inUpdateMessageId]);

    const setNewMessageText = (newMessageText: string): void => {
        if (inputTextRef.current) {
            inputTextRef.current.value = newMessageText;
            setMessageText(newMessageText);
            if (!newMessageText) {
                inputTextRef.current.style.height = INPUT_TEXT_DEFAULT_HEIGHT;
                return;
            }
            if (inputTextRef.current.scrollHeight > 300 || inputTextRef.current.scrollHeight < 25)
                return;

            inputTextRef.current.style.height = (inputTextRef.current.scrollHeight) + 'px';
        }
    };

    const onKeyUpInputText = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.code === 'Enter' && !e.shiftKey) {
            primaryButtonClickHandler();
        }
    };

    const onKeyDownInputText = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.code === 'Enter' && !e.shiftKey) {
            e.preventDefault();
        }
    };

    const closeExtraBlockHandler = () => {
        switch (mode) {
            case Mode.Updating:
                setNewMessageText('');
                dispatch(chatActions.setInUpdateMessageId(null));
                dispatch(chatActions.setMode(Mode.Text));
                break;
            case Mode.Reply:
                dispatch(chatActions.setReplyMessageId(null));
                dispatch(chatActions.setMode(Mode.Text));
                break;
            case Mode.Forward:
                dispatch(chatActions.setForwardMessages([]));
                dispatch(chatActions.setMode(Mode.Text));
                break;
        }

    };

    const sendMessageHandler = () => {
        if (!messageText && !files.length && !forwardMessages.length)
            return;

        if (!selectedChat)
            return;

        setMessageText('');
        setFiles([]);
        dispatch(chatActions.messageSendAsync({
            chatId: selectedChat.id,
            sentMessageInput: {
                identifier: selectedChat.identifier,
                text: messageText,
                replyMessageId,
                files,
                forwardedMessageIds: forwardMessages.map(m => m.id),
            },
        }));
        if (inputTextRef.current)
            inputTextRef.current.style.height = INPUT_TEXT_DEFAULT_HEIGHT;
            
        setIsEmojiPickerVisible(false);
        scrollToBottom();

        if (mode === Mode.Reply || mode === Mode.Forward)
            closeExtraBlockHandler();
    };

    const updateMessageHandler = () => {
        if (inUpdateMessageId) {
            dispatch(chatActions.messageUpdateAsync({
                messageId: inUpdateMessageId,
                text: messageText,
            }));
            closeExtraBlockHandler();
        }
    };

    const primaryButtonClickHandler = () => {
        switch (mode) {
            case Mode.Text:
            case Mode.Reply:
            case Mode.Forward:
                sendMessageHandler();
                break;
            case Mode.Updating:
                updateMessageHandler();
                break;
        }
    };

    const renderExtraBlock = () => {
        const renderExtraBlockRelatedMessage = (svg: string, iconClassName?: string | null, action?: string | null, messageText?: string | null, fileUrl?: string | null, fileType?: FileType | null) => {
            let file: JSX.Element | null = null;
            switch (fileType) {
                case FileType.Image:
                    file = <img src={fileUrl || ''} className={styles.media} />;
                    break;
                case FileType.Video:
                    file = <video src={fileUrl || ''} className={styles.media} />;
                    break;
            }
            switch (fileType) {
                default:
                    return (
                        <>
                            <div className={styles.icon}>
                                <img src={svg} width={20} className={['primarySvg', iconClassName].join(' ')} alt={'pencilOutlinedSvg'} />
                            </div>
                            {file}
                            <div className={styles.actionAndText}>
                                <div className={styles.action}>{action}</div>
                                <div className={styles.text}>{messageText}</div>
                            </div>
                        </>
                    );
            }
        };

        switch (mode) {
            case Mode.Updating: {
                const fileType = inUpdateMessage?.fileUrl ? getFileType(inUpdateMessage.fileUrl) : null;
                return renderExtraBlockRelatedMessage(pencilOutlinedSvg, null, 'Updating', inUpdateMessage?.text || getFileName(inUpdateMessage?.fileUrl || ''), inUpdateMessage?.fileUrl, fileType);
            }
            case Mode.Reply: {
                const fileType = replyMessage?.fileUrl ? getFileType(replyMessage.fileUrl) : null;
                return renderExtraBlockRelatedMessage(replySvg, null, replyMessage?.from?.fullName, replyMessage?.text || getFileName(replyMessage?.fileUrl || ''), replyMessage?.fileUrl, fileType);
            }
            case Mode.Forward: {
                switch (forwardMessages.length) {
                    case 0:
                        return null;
                    case 1:
                        const forwardMessage = forwardMessages[0];
                        return renderExtraBlockRelatedMessage(replySvg, styles.forwardSvg, forwardMessage?.from?.fullName, forwardMessage?.text || getFileName(forwardMessage?.fileUrl || ''), forwardMessage?.fileUrl, null);
                    default:
                        const action = forwardMessages[0]?.from?.fullName + ' and others';
                        return renderExtraBlockRelatedMessage(replySvg, styles.forwardSvg, action, `${forwardMessages.length} forwarded messages`, null, null);
                }
            }
        }
    };

    const renderPrimaryButtonIcon = () => {
        switch (mode) {
            case Mode.Text:
            case Mode.Reply:
            case Mode.Forward:
                return (
                    messageText || files.length || forwardMessages.length
                        ? (
                            <motion.img
                              key={'send'}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              src={sendSvg}
                              className={'primaryTextSvg'}
                            />
                        )
                        : (
                            <motion.img
                              key={'microphone'}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              src={microphoneSvg}
                              width={25}
                              className={'primaryTextSvg'}
                            />
                        )
                );
            case Mode.Updating:
                return (
                    <motion.img
                      key={'update'}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src={checkSvg}
                      width={25}
                      className={'primaryTextSvg'}
                    />
                );
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.wrapperInputText}>
                    {mode !== Mode.Text && mode !== Mode.ForwardSelectChat &&
                        <div className={styles.extraBlockWrapper}>
                            <div className={styles.extraBlockInner}>
                                {renderExtraBlock()}
                            </div>
                            <div onClick={closeExtraBlockHandler} className={styles.close}>
                                <img src={crossFilledSvg} width={15} className={'secondaryTextSvg'} alt={'crossFilledSvg'} />
                            </div>
                        </div>
                    }
                    {files.length > 0 && (
                        <div className={styles.files}>
                            {files.map(file => (
                                <div className={styles.file}>
                                    <div className={styles.icon}>
                                        <img src={fileSvg} width={20} className={'primarySvg'} alt={'pencilOutlinedSvg'} />
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.infoInner}>
                                            <div className={styles.name}>{file.name}</div>
                                            <div className={styles.size}>{file.size} B</div>
                                        </div>
                                        <div onClick={() => setFiles(files.filter(f => f !== file))} className={styles.close}>
                                            <img src={crossFilledSvg} width={15} className={'secondaryTextSvg'} alt={'crossFilledSvg'} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className={styles.innerInputText}> 
                        <div className={`${styles.inputTextButton} ${styles.wrapperEmojiPicker}`}>
                            <img src={smileSvg} width={20} className={'secondaryTextSvg'} alt={'smileSvg'} onClick={_ => setIsEmojiPickerVisible(!isEmojiPickerVisible)} />
                            {isEmojiPickerVisible &&
                                <div className={styles.emojiPicker}>        
                                    <EmojiPicker theme={Theme.DARK} onEmojiClick={ed => setMessageText(messageText + ed.emoji)} />
                                </div>
                            } 
                        </div>
                        <textarea
                          value={messageText}
                          placeholder={'Message'}
                          ref={inputTextRef}
                          onChange={e => setNewMessageText(e.target.value)}
                          className={styles.inputText}
                          onKeyUp={onKeyUpInputText}
                          onKeyDown={onKeyDownInputText}
                        />
                        <InputFile multiple onChange={newFiles => setFiles(newFiles ? [...files, ...newFiles] : [])}>
                            <div className={styles.inputTextButton}>
                                <img src={clipSvg} width={20} className={'secondaryTextSvg'} alt={'clipSvg'} />
                            </div>
                        </InputFile>
                    </div>
                </div>
                <div className={styles.buttonSend}>
                    <SmallPrimaryButton onClick={primaryButtonClickHandler}>
                        <AnimatePresence>
                            {renderPrimaryButtonIcon()}
                        </AnimatePresence>
                    </SmallPrimaryButton>
                </div>
            </div>
        </div>
    );
};