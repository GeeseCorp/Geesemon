import React, { FC, useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import deleteSvg from "../../../assets/svg/delete.svg";
import pencilOutlinedSvg from "../../../assets/svg/pencilOutlined.svg";
import { chatActions } from "../../../behavior/features/chats";
import { Message, MessageKind } from '../../../behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from "../../../behavior/store";
import { getDate, getDayAndMonth, getTimeWithoutSeconds } from "../../../utils/dateUtils";
import { ContextMenu } from "../../common/ContextMenu/ContextMenu";
import { Checks } from "../Checks/Checks";
import { SendMessageForm } from "../SendMessageForm/SendMessageForm";
import s from './Messages.module.scss';

export const Messages: FC = () => {
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const params = useParams();
    const chatId = params.chatId as string;
    const inUpdateMessageId = useAppSelector(s => s.chats.inUpdateMessageId);
    const messageGetLoading = useAppSelector(s => s.chats.messageGetLoading);
    const messages = useAppSelector(s => s.chats.chats.find(c => c.id === chatId)?.messages) || [];
    const dispatch = useAppDispatch();
    const [isAutoScroll, setIsAutoScroll] = useState(false);
    const bottomOfMessagesRef = useRef<HTMLDivElement>(null);
    const inputTextRef = useRef<HTMLTextAreaElement | null>(null)

    const scrollToBottom = () => {
        bottomOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
    };

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

    const setInUpdateMessage = (messageId: string) => {
        dispatch(chatActions.setInUpdateMessageId(messageId))
        dispatch(chatActions.setMode('Updating'))
        inputTextRef.current?.focus();
    }

    const messageContent = (message: Message) => {
        const isMessageMy = message.fromId === authedUser?.id;
        switch (message.type) {
            case MessageKind.System:
                return (
                    <div className={[s.message, s.messageSystem].join(' ')}>
                        <span className={s.messageText}>{message.text}</span>
                    </div>
                )
            default:
                return (
                    <div
                        className={[s.message, isMessageMy ? s.messageMy : null].join(' ')}
                    >
                        <span className={s.messageText}>{message.text}</span>
                        <span className={s.messageInfo}>
                            {message.createdAt !== message.updatedAt &&
                                <span className={['small', s.small].join(' ')}>Edited</span>
                            }
                            <span className={['small', s.small].join(' ')}>
                                {getTimeWithoutSeconds(new Date(message.createdAt))}
                            </span>
                            {isMessageMy && <Checks double={!!message.readMessages?.length} />}
                        </span>
                    </div>
                );
        }
    }

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
                                    className={[s.message, s.messageSystem].join(' ')}
                                >
                                    {getDayAndMonth(new Date(messages[i].createdAt))}
                                </div>
                            )
                        if (i + 1 < messages.length && getDate(new Date(message.createdAt)) !== getDate(new Date(messages[i + 1].createdAt))) {
                            returnJsx.push(
                                <div
                                    key={messages[i + 1].createdAt}
                                    className={[s.message, s.messageSystem].join(' ')}
                                >
                                    {getDayAndMonth(new Date(messages[i + 1].createdAt))}
                                </div>
                            )
                        }
                        returnJsx.push(
                            <ContextMenu
                                key={message.id}
                                items={[
                                    {
                                        content: 'Update',
                                        icon: <img src={pencilOutlinedSvg} width={15} className={'primaryTextSvg'}/>,
                                        onClick: () => setInUpdateMessage(message.id),
                                        type: 'default',
                                    },
                                    {
                                        content: 'Delete',
                                        icon: <img src={deleteSvg} width={20} className={'dangerSvg'}/>,
                                        onClick: () => dispatch(chatActions.messageDeleteAsync({ messageId: message.id })),
                                        type: 'danger',
                                    },
                                ]}
                            >
                                {messageContent(message)}
                            </ContextMenu>
                        )
                        return returnJsx;
                    })}
                </div>
                <div ref={bottomOfMessagesRef} />
            </div>
            <SendMessageForm scrollToBottom={scrollToBottom} inputTextRef={inputTextRef} />
        </div>
    );
};