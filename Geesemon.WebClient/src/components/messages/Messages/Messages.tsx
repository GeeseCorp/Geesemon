import React, { FC, useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import { chatActions } from "../../../behavior/features/chats";
import { useAppDispatch, useAppSelector } from "../../../behavior/store";
import { getDate, getDayAndMonth } from "../../../utils/dateUtils";
import { Message } from '../Message/Message';
import { SendMessageForm } from "../SendMessageForm/SendMessageForm";
import s from './Messages.module.scss';
import sMessage from '../Message/Message.module.scss';

export const Messages: FC = () => {
    const params = useParams();
    const chatId = params.chatId as string;
    const messageGetLoading = useAppSelector(s => s.chats.messageGetLoading);
    const messages = useAppSelector(s => s.chats.chats.find(c => c.id === chatId)?.messages) || [];
    const dispatch = useAppDispatch();
    const [isAutoScroll, setIsAutoScroll] = useState(false);
    const bottomOfMessagesRef = useRef<HTMLDivElement>(null);
    const inputTextRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        if (isAutoScroll) {
            console.log(isAutoScroll, 'scrollToBottom')
            scrollToBottom();
        }
    }, [messages])

    useEffect(() => {
        bottomOfMessagesRef.current?.scrollIntoView();
    }, [chatId])

    const onScrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        let scrollPosition = Math.abs(element.scrollHeight - element.scrollTop) - element.clientHeight;
        if (scrollPosition < 70)
            !isAutoScroll && setIsAutoScroll(true);
        else
            isAutoScroll && setIsAutoScroll(false);

        if (element.scrollTop < 100 && !messageGetLoading) {
            dispatch(chatActions.messageGetAsync({
                chatId,
                skip: messages.length,
            }))
        }
    };

    const scrollToBottom = () => {
        bottomOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
    };

    return (
        <div className={s.wrapper}>
            <div className={s.messages} onScroll={onScrollHandler}>
                <div className={s.messagesInner}>
                    {messages.flatMap((message, i) => {
                        const returnJsx: React.ReactNode[] = []
                        if (i === 0)
                            returnJsx.push(
                                <div
                                    key={messages[i].createdAt}
                                    className={[sMessage.message, sMessage.messageSystem].join(' ')}
                                >
                                    {getDayAndMonth(new Date(messages[i].createdAt))}
                                </div>
                            )
                        if (i + 1 < messages.length && getDate(new Date(message.createdAt)) !== getDate(new Date(messages[i + 1].createdAt))) {
                            returnJsx.push(
                                <div
                                    key={messages[i + 1].createdAt}
                                    className={[sMessage.message, sMessage.messageSystem].join(' ')}
                                >
                                    {getDayAndMonth(new Date(messages[i + 1].createdAt))}
                                </div>
                            )
                        }
                        returnJsx.push(<Message message={message} inputTextRef={inputTextRef} key={message.id} />)
                        return returnJsx;
                    })}
                </div>
                <div ref={bottomOfMessagesRef} />
            </div>
            <SendMessageForm scrollToBottom={scrollToBottom} inputTextRef={inputTextRef} />
        </div>
    );
};