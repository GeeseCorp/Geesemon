import { AnimatePresence, motion } from 'framer-motion';
import { FC, KeyboardEvent, MutableRefObject, useEffect, useState } from 'react';
import check from '../../../assets/svg/check.svg';
import clip from '../../../assets/svg/clip.svg';
import crossFilled from '../../../assets/svg/crossFilled.svg';
import microphone from '../../../assets/svg/microphone.svg';
import pencilOutlined from '../../../assets/svg/pencilOutlined.svg';
import send from '../../../assets/svg/send.svg';
import smile from '../../../assets/svg/smile.svg';
import { chatActions } from '../../../behavior/features/chats';
import { ChatKind } from '../../../behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useSelectedChat } from '../../../hooks/useSelectedChat';
import { isGuidEmpty } from '../../../utils/stringUtils';
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

    const onInputText = () => {
        const newMessageText = inputTextRef.current?.value || '';
        setNewMessageText(newMessageText);
    };

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
            console.log(isGuidEmpty(selectedChat.id) && (selectedChat.type === ChatKind.Personal || selectedChat.type === ChatKind.Saved));
            dispatch(chatActions.messageSendAsync({
                chatId: selectedChat.id,
                sentMessageInputType: {
                    chatUsername: selectedChat.username,
                    text: messageText,
                },
            }));
            setMessageText('');
            if (inputTextRef.current)
                inputTextRef.current.style.height = INPUT_TEXT_DEFAULT_HEIGHT;
            scrollToBottom();
        }
    };

    const onKeyUpInputText = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.code === 'Enter' && !e.shiftKey) {
            strongButtonClickHandler();
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

    const strongButtonClickHandler = () => {
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
                                    <img src={pencilOutlined} width={20} className={'primarySvg'} />
                                </div>
                                <div className={s.actionAndText}>
                                    <div className={s.action}>Updating</div>
                                    <div className={s.text}>{inUpdateMessage.text}</div>
                                </div>
                            </div>
                            <div onClick={closeExtraBlockHandler} className={s.close}>
                                <img src={crossFilled} width={15} className={'secondaryTextSvg'} />
                            </div>
                        </div>
                    }
                    <div className={s.innerInputText}>
                        <div className={s.inputTextButton}>
                            <img src={smile} width={20} className={'secondaryTextSvg'} />
                        </div>
                        <textarea
                          value={messageText}
                          placeholder={'Message'}
                          ref={inputTextRef}
                          onInput={onInputText}
                          className={s.inputText}
                          onKeyUp={onKeyUpInputText}
                          onKeyDown={onKeyDownInputText}
                        />
                        <div className={s.inputTextButton}>
                            <img src={clip} width={20} className={'secondaryTextSvg'} />
                        </div>
                    </div>
                </div>
                <div className={s.buttonSend}>
                    <SmallPrimaryButton onClick={strongButtonClickHandler}>
                        <AnimatePresence>
                            {inUpdateMessageId
                                ? (
                                    <motion.img
                                      key={'update'}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      src={check}
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
                                          src={send}
                                          className={'primaryTextSvg'}
                                        />
                                    )
                                    : (
                                        <motion.img
                                          key={'microphone'}
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          src={microphone}
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