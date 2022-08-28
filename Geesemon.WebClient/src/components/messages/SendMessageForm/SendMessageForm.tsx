import React, {FC, useRef, useState} from 'react';
import s from './SendMessageForm.module.css';
import smile from "../../../assets/svg/smile.svg";
import send from "../../../assets/svg/send.svg";
import clip from "../../../assets/svg/clip.svg";
import microphone from "../../../assets/svg/microphone.svg";
import {AnimatePresence, motion} from "framer-motion"
import {StrongButton} from "../../common/StrongButton/StrongButton";
import {useAppDispatch} from "../../../behavior/store";
import {chatActions} from "../../../behavior/features/chats";
import {useParams} from "react-router-dom";

type Props = {};
export const SendMessageForm: FC<Props> = () => {
    const inputTextRef = useRef<HTMLTextAreaElement | null>(null)
    const [messageText, setMessageText] = useState('');
    const dispatch = useAppDispatch();
    const params = useParams()
    const chatId = params.chatId as string;

    const onInputText = () => {
        if (inputTextRef.current) {
            const newMessageText = inputTextRef.current?.value;
            setMessageText(newMessageText)
            if (!newMessageText) {
                inputTextRef.current.style.height = '25px';
                return;
            }
            if (inputTextRef.current.scrollHeight > 400 || inputTextRef.current.scrollHeight < 25)
                return;

            inputTextRef.current.style.height = (inputTextRef.current.scrollHeight) + "px";
        }
    }

    const sendMessageHandler = () => {
        dispatch(chatActions.messageSendAsync({
            chatId,
            text: messageText,
        }))
    }

    return (
        <div className={s.wrapper}>
            <div className={s.wrapperInputText}>
                <img src={smile} className={s.inputTextButton}/>
                <textarea
                    value={messageText}
                    placeholder={'Message'}
                    ref={inputTextRef}
                    onInput={onInputText}
                    className={s.inputText}
                />
                <img src={clip} className={s.inputTextButton}/>
            </div>
            <div className={s.buttonSend}>
                <StrongButton onClick={
                    messageText
                        ? sendMessageHandler
                        : undefined
                }>
                    <AnimatePresence>
                        {messageText
                            ? <motion.img
                                key={'send'}
                                initial={{scale: 0, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                src={send}
                            />
                            : <motion.img
                                key={'microphone'}
                                initial={{scale: 0, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                src={microphone}
                                width={25}
                            />
                        }
                    </AnimatePresence>
                </StrongButton>
            </div>
        </div>
    );
};