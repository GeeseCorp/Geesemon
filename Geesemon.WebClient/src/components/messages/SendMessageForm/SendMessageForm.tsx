import { AnimatePresence, motion } from 'framer-motion';
import { FC, KeyboardEvent, MutableRefObject, useEffect, useState } from 'react';
import checkSvg from '../../../assets/svg/check.svg';
import clipSvg from '../../../assets/svg/clip.svg';
import crossFilledSvg from '../../../assets/svg/crossFilled.svg';
import microphoneSvg from '../../../assets/svg/microphone.svg';
import pencilOutlinedSvg from '../../../assets/svg/pencilOutlined.svg';
import sendSvg from '../../../assets/svg/send.svg';
import smileSvg from '../../../assets/svg/smile.svg';
import { chatActions } from '../../../behavior/features/chats';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useSelectedChat } from '../../../hooks/useSelectedChat';
import { SmallPrimaryButton } from '../../common/SmallPrimaryButton/SmallPrimaryButton';
import s from './SendMessageForm.module.scss';

const INPUT_TEXT_DEFAULT_HEIGHT = '25px';

type Props = {
    scrollToBottom: () => void;
    inputTextRef: MutableRefObject<HTMLTextAreaElement | null>;
};

export const SendMessageForm: FC<Props> = ({ scrollToBottom, inputTextRef }) => {
    const mode = useAppSelector(s => s.chats.mode);
    const inUpdateMessageId = useAppSelector(s => s.chats.inUpdateMessageId);
    const [messageText, setMessageText] = useState('');
    const dispatch = useAppDispatch();
    const selectedChat = useSelectedChat();
    const messages = selectedChat?.messages || [];
    const inUpdateMessage = messages.find(m => m.id === inUpdateMessageId);

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
            if (inputTextRef.current.scrollHeight > 400 || inputTextRef.current.scrollHeight < 25)
                return;

            inputTextRef.current.style.height = (inputTextRef.current.scrollHeight) + 'px';
        }
    };

    const sendMessageHandler = () => {
        if (!messageText)
            return;

        if(selectedChat){
            setMessageText('');
            dispatch(chatActions.messageSendAsync({
                chatId: selectedChat.id,
                sentMessageInput: {
                    chatUsername: selectedChat.username,
                    text: messageText,
                },
            }));
            
            if (inputTextRef.current)
                inputTextRef.current.style.height = INPUT_TEXT_DEFAULT_HEIGHT;

            scrollToBottom();
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
            case 'Updating':
                setNewMessageText('');
                dispatch(chatActions.setInUpdateMessageId(null));
                dispatch(chatActions.setMode('Text'));
                break;
        }

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
            case 'Text':
                sendMessageHandler();
                break;
            case 'Updating':
                updateMessageHandler();
                break;
        }
    };

    return (
        <div className={s.wrapper}>
            <div className={s.inner}>
                <div className={s.wrapperInputText}>
                    {inUpdateMessage &&
                        <div className={s.extraBlockWrapper}>
                            <div className={s.extraBlockInner}>
                                <div className={s.icon}>
                                    <img src={pencilOutlinedSvg} width={20} className={'primarySvg'} alt={'pencilOutlinedSvg'} />
                                </div>
                                <div className={s.actionAndText}>
                                    <div className={s.action}>Updating</div>
                                    <div className={s.text}>{inUpdateMessage.text}</div>
                                </div>
                            </div>
                            <div onClick={closeExtraBlockHandler} className={s.close}>
                                <img src={crossFilledSvg} width={15} className={'secondaryTextSvg'} alt={'crossFilledSvg'} />
                            </div>
                        </div>
                    }
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
                        <div className={s.inputTextButton}>
                            <img src={clipSvg} width={20} className={'secondaryTextSvg'} alt={'clipSvg'} />
                        </div>
                    </div>
                </div>
                <div className={s.buttonSend}>
                    <SmallPrimaryButton onClick={primaryButtonClickHandler}>
                        <AnimatePresence>
                            {inUpdateMessageId
                                ? (
                                    <motion.img
                                      key={'update'}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      src={checkSvg}
                                      width={25}
                                      className={'primaryTextSvg'}
                                    />
                                )
                                : messageText
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
                            }
                        </AnimatePresence>
                    </SmallPrimaryButton>
                </div>
            </div>
        </div>
    );
};