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
import s from './SendMessageForm.module.scss';
import { InputFile } from '../../common/formControls/InputFile/InputFile';
import { FileType, getFileType } from '../../../utils/fileUtils';
import { getFileName } from '../../../utils/stringUtils';

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
    const dispatch = useAppDispatch();
    const selectedChat = useSelectedChat();
    const messages = selectedChat?.messages || [];
    const inUpdateMessage = messages.find(m => m.id === inUpdateMessageId);
    const replyMessage = messages.find(m => m.id === replyMessageId);
    const [files, setFiles] = useState<File[]>([]);
    const forwardMessageIds = useAppSelector(s => s.chats.forwardMessageIds);

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
                dispatch(chatActions.setForwardMessageIds([]));
                dispatch(chatActions.setMode(Mode.Text));
                break;
        }

    };

    const sendMessageHandler = () => {
        if (!messageText && !files.length && !forwardMessageIds.length)
            return;

        if (!selectedChat)
            return;

        setMessageText('');
        setFiles([]);
        dispatch(chatActions.setSelectedMessageIds([]));
        dispatch(chatActions.messageSendAsync({
            chatId: selectedChat.id,
            sentMessageInput: {
                identifier: selectedChat.identifier,
                text: messageText,
                replyMessageId,
                files,
                forwardedMessageIds: forwardMessageIds,
            },
        }));

        if (inputTextRef.current)
            inputTextRef.current.style.height = INPUT_TEXT_DEFAULT_HEIGHT;

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
            case Mode.Updating:
                updateMessageHandler();
                break;
            default:
                sendMessageHandler();
                break;
        }
    };

    const renderExtraBlock = () => {
        const renderExtraBlockRelatedMessage = (svg: string, iconClassName?: string | null, action?: string | null, messageText?: string | null, fileUrl?: string | null, fileType?: FileType | null) => {
            let file: JSX.Element | null = null;
            switch (fileType) {
                case FileType.Image:
                    file = <img src={fileUrl || ''} className={s.media} />;
                    break;
                case FileType.Video:
                    file = <video src={fileUrl || ''} className={s.media} />;
                    break;
            }
            switch (fileType) {
                default:
                    return (
                        <>
                            <div className={s.icon}>
                                <img src={svg} width={20} className={['primarySvg', iconClassName].join(' ')} alt={'pencilOutlinedSvg'} />
                            </div>
                            {file}
                            <div className={s.actionAndText}>
                                <div className={s.action}>{action}</div>
                                <div className={s.text}>{messageText}</div>
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
                const firstForwardMessageId = forwardMessageIds.length ? forwardMessageIds[0] : null;
                const firstForwardMessage = selectedChat?.messages.find(m => m.id === firstForwardMessageId);
                switch (forwardMessageIds.length) {
                    case 0:
                        return null;
                    case 1:
                        return renderExtraBlockRelatedMessage(replySvg, s.forwardSvg, firstForwardMessage?.from?.fullName, firstForwardMessage?.text || getFileName(firstForwardMessage?.fileUrl || ''), firstForwardMessage?.fileUrl, null);
                    default:
                        const action = firstForwardMessage?.from?.fullName + ' and others';
                        return renderExtraBlockRelatedMessage(replySvg, s.forwardSvg, action, `${forwardMessageIds.length} forwarded messages`, null, null);
                }
            }
        }
    };

    const renderPrimaryButtonIcon = () => {
        switch (mode) {
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
            default:
                return (
                    messageText || files.length || forwardMessageIds.length
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
        <div className={s.wrapper}>
            <div className={s.inner}>
                <div className={s.wrapperInputText}>
                    {mode !== Mode.Text && mode !== Mode.ForwardSelectChat &&
                        <div className={s.extraBlockWrapper}>
                            <div className={s.extraBlockInner}>
                                {renderExtraBlock()}
                            </div>
                            <div onClick={closeExtraBlockHandler} className={s.close}>
                                <img src={crossFilledSvg} width={15} className={'secondaryTextSvg'} alt={'crossFilledSvg'} />
                            </div>
                        </div>
                    }
                    {files.length > 0 && (
                        <div className={s.files}>
                            {files.map(file => (
                                <div className={s.file}>
                                    <div className={s.icon}>
                                        <img src={fileSvg} width={20} className={'primarySvg'} alt={'pencilOutlinedSvg'} />
                                    </div>
                                    <div className={s.info}>
                                        <div className={s.infoInner}>
                                            <div className={s.name}>{file.name}</div>
                                            <div className={s.size}>{file.size} B</div>
                                        </div>
                                        <div onClick={() => setFiles(files.filter(f => f !== file))} className={s.close}>
                                            <img src={crossFilledSvg} width={15} className={'secondaryTextSvg'} alt={'crossFilledSvg'} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className={s.innerInputText}>
                        <div className={s.inputTextButton}>
                            <img src={smileSvg} width={20} className={'secondaryTextSvg'} alt={'smileSvg'} />
                        </div>
                        <textarea
                          value={messageText}
                          placeholder={'Message'}
                          ref={inputTextRef}
                          onChange={e => setNewMessageText(e.target.value)}
                          className={s.inputText}
                          onKeyUp={onKeyUpInputText}
                          onKeyDown={onKeyDownInputText}
                        />
                        <InputFile multiple onChange={newFiles => setFiles(newFiles ? [...files, ...newFiles] : [])}>
                            <div className={s.inputTextButton}>
                                <img src={clipSvg} width={20} className={'secondaryTextSvg'} alt={'clipSvg'} />
                            </div>
                        </InputFile>
                    </div>
                </div>
                <div className={s.buttonSend}>
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