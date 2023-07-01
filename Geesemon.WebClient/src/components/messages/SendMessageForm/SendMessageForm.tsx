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
import deleteSvg from '../../../assets/svg/delete.svg';
import cameraSvg from '../../../assets/svg/camera.svg';
import { chatActions } from '../../../behavior/features/chats';
import { Mode } from '../../../behavior/features/chats/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useSelectedChat } from '../../../hooks/useSelectedChat';
import { SmallPrimaryButton } from '../../common/SmallPrimaryButton/SmallPrimaryButton';
import { InputFile } from '../../common/formControls/InputFile/InputFile';
import { FileType, getFileType } from '../../../utils/fileUtils';
import { getFileName } from '../../../utils/stringUtils';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';
import moment from 'moment';
import { MediaKind } from '../../../behavior/features/chats/types';
import { RecordingState, useAudioRecorder } from '../../../hooks/useAudioRecorder';
import { RoundVideoRecordingModal } from './RoundVideoRecordingModal';
import { VolumeIndicator } from './VolumeIndicator';
import { TimeAndIndicator } from './TimeAndIndicator';
import { localStorageGetItem, localStorageSetItem } from '../../../utils/localStorageUtils';

const INPUT_TEXT_DEFAULT_HEIGHT = '25px';

type Props = {
    scrollToBottom: () => void;
    inputTextRef: MutableRefObject<HTMLTextAreaElement | null>;
};

export type RecordingType = 'Voice' | 'RoundVideo';

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
    const forwardMessageIds = useAppSelector(s => s.chats.forwardMessageIds);
    const T = useGeeseTexts();
    const [recordingType, setRecordingType] = useState<RecordingType>(localStorageGetItem('RecordingType') as RecordingType || 'Voice');

    const onGetRecord = (blob: Blob) => {
        const type = recordingType === 'Voice' ? 'audio/mp3' : 'video/webm';
        const fileName = recordingType === 'Voice'
            ? `voice_${moment().format('YYYY-MM-DD_hh-mm-ss')}.mp3`
            : `round_video_${moment().format('YYYY-MM-DD_hh-mm-ss')}.webm`;
        const file = new File([blob], fileName, { type });
        setFiles([file]);
    };

    const {
        startRecording,
        stopRecording,
        discardRecording,
        recordingState,
        recordingTime,
        volume,
        mediaStream,
    } = useAudioRecorder(recordingType === 'RoundVideo', onGetRecord);

    useEffect(() => {
        if (inUpdateMessageId && inUpdateMessage) {
            setNewMessageText(inUpdateMessage.text || '');
        }
    }, [inUpdateMessageId]);

    useEffect(() => {
        if (files.length && mode === Mode.Recording) {
            sendMessageHandler();
        }
    }, [files.length]);

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
                break;
            case Mode.Reply:
                dispatch(chatActions.setReplyMessageId(null));
                break;
            case Mode.Forward:
                dispatch(chatActions.setForwardMessageIds([]));
                break;
        }
    };

    const getMediaKind = (): MediaKind | null => {
        switch (mode) {
            case Mode.Recording:
                return recordingType === 'Voice' ? MediaKind.Voice : MediaKind.Video;
            default:
                return null;
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
                mediaKind: getMediaKind(),
            },
        }));

        if (inputTextRef.current)
            inputTextRef.current.style.height = INPUT_TEXT_DEFAULT_HEIGHT;

        setIsEmojiPickerVisible(false);
        scrollToBottom();

        if (mode === Mode.Reply || mode === Mode.Forward)
            closeExtraBlockHandler();

        dispatch(chatActions.setMode(Mode.Text));
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

    const startRecordingHandler = () => {
        dispatch(chatActions.setMode(Mode.Recording));
        startRecording();
    };

    const discardRecordingHandler = () => {
        dispatch(chatActions.setMode(Mode.Text));
        discardRecording();
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
                const firstForwardMessageId = forwardMessageIds.length ? forwardMessageIds[0] : null;
                const firstForwardMessage = selectedChat?.messages.find(m => m.id === firstForwardMessageId);
                switch (forwardMessageIds.length) {
                    case 0:
                        return null;
                    case 1:
                        return renderExtraBlockRelatedMessage(replySvg, styles.forwardSvg, firstForwardMessage?.from?.fullName, firstForwardMessage?.text || getFileName(firstForwardMessage?.fileUrl || ''), firstForwardMessage?.fileUrl, null);
                    default:
                        const action = firstForwardMessage?.from?.fullName + ' and others';
                        return renderExtraBlockRelatedMessage(replySvg, styles.forwardSvg, action, `${forwardMessageIds.length} forwarded messages`, null, null);
                }
            }
        }
    };

    const primaryButtonClickHandler = () => {
        switch (mode) {
            case Mode.Updating:
                updateMessageHandler();
                break;
            default:
                if (messageText || files.length || forwardMessageIds.length) {
                    sendMessageHandler();
                }
                else {
                    switch (recordingState) {
                        case RecordingState.Default:
                            startRecordingHandler();
                            break;
                        case RecordingState.Recording:
                            stopRecording();
                            break;
                    }
                }
                break;
        }
    };

    const onRightClickHandler = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const newValue = recordingType === 'Voice' ? 'RoundVideo' : 'Voice';
        setRecordingType(newValue);
        localStorageSetItem('RecordingType', newValue);
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
                    messageText || files.length || forwardMessageIds.length || (recordingState === RecordingState.Recording && recordingType === 'Voice')
                        ? (
                            <motion.img
                                key={'send'}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={sendSvg}
                                className={'primaryTextSvg'}
                            />
                        )
                        : recordingType === 'Voice'
                            ? (
                                <motion.img
                                    key={'microphone'}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={microphoneSvg}
                                    width={25}
                                    className={'primaryTextSvg'}
                                />
                            )
                            : (
                                <motion.img
                                    key={'cameraSvg'}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={cameraSvg}
                                    width={25}
                                    className={'primaryTextSvg'}
                                />
                            )
                );
        }
    };

    const isRenderExtraBlock = () => {
        const renderExtraBlockForModes = [Mode.Updating, Mode.Reply, Mode.Forward];
        return renderExtraBlockForModes.includes(mode);
    };

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.inner}>
                    <div className={styles.wrapperInputText}>
                        {isRenderExtraBlock() &&
                            <div className={styles.extraBlockWrapper}>
                                <div className={styles.extraBlockInner}>
                                    {renderExtraBlock()}
                                </div>
                                <div onClick={closeExtraBlockHandler} className={styles.close}>
                                    <img src={crossFilledSvg} width={15} className={'secondaryTextSvg'} alt={'crossFilledSvg'} />
                                </div>
                            </div>
                        }
                        {recordingState === RecordingState.Default && files.length > 0 && (
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
                                placeholder={T.WriteAMessage}
                                ref={inputTextRef}
                                onChange={e => setNewMessageText(e.target.value)}
                                className={styles.inputText}
                                onKeyUp={onKeyUpInputText}
                                onKeyDown={onKeyDownInputText}
                            />
                            {recordingState === RecordingState.Recording && recordingType === 'Voice'
                                ? <TimeAndIndicator recordingTime={recordingTime} />
                                : (
                                    <InputFile multiple onChange={newFiles => setFiles(newFiles ? [...files, ...newFiles] : [])}>
                                        <div className={styles.inputTextButton}>
                                            <img src={clipSvg} width={20} className={'secondaryTextSvg'} alt={'clipSvg'} />
                                        </div>
                                    </InputFile>
                                )}
                        </div>
                    </div>
                    {recordingState === RecordingState.Recording && recordingType === 'Voice' && (
                        <SmallPrimaryButton onClick={discardRecordingHandler} className={styles.buttonDiscardRecording}>
                            <AnimatePresence>
                                <motion.img
                                    key={'discard'}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={deleteSvg}
                                    width={25}
                                    className={'dangerSvg'}
                                />
                            </AnimatePresence>
                        </SmallPrimaryButton>
                    )}
                    {recordingState === RecordingState.Recording && recordingType === 'Voice' && <VolumeIndicator volume={volume} right="-30px" />}
                    <SmallPrimaryButton onClick={primaryButtonClickHandler} className={styles.buttonSend} onRightClick={onRightClickHandler}>
                        <AnimatePresence>
                            {renderPrimaryButtonIcon()}
                        </AnimatePresence>
                    </SmallPrimaryButton>
                </div>
            </div>
            <RoundVideoRecordingModal
                mediaStream={mediaStream}
                recordingState={recordingState}
                recordingType={recordingType}
                volume={volume}
                recordingTime={recordingTime}
                stopRecording={stopRecording}
                discardRecording={discardRecordingHandler}
            />
        </>
    );
};