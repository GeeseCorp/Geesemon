import React, {FC, useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../behavior/store";
import {useParams} from "react-router-dom";
import s from './Messages.module.css';
import {getDate, getDayAndMonth, getTimeWithoutSeconds} from "../../../utils/dateUtils";
import {Checks} from "../Checks/Checks";
import {DeleteOutlined} from "@ant-design/icons";
import {ContextMenu} from "../../common/ContextMenu/ContextMenu";
import {SendMessageForm} from "../SendMessageForm/SendMessageForm";
import {chatActions} from "../../../behavior/features/chats";

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
    // const [firstMessageId, setFirstMessageId] = useState<string | null>(null)
    // let firstMessageRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        bottomOfMessagesRef.current?.scrollIntoView({behavior: 'smooth'})
    };

    useEffect(() => {
        if (isAutoScroll) {
            console.log(isAutoScroll, 'scrollToBottom')
            scrollToBottom();
        }
        // else {
        //     console.log(firstMessageRef.current)
        //     firstMessageRef.current?.scrollIntoView();
        // }
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
            // messages.length && setFirstMessageId(messages[0].id)
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

    return (
        <div className={s.wrapper}>
            <div className={s.messages} onScroll={onScrollHandler}>
                <div className={s.messagesInner}>
                    {messages.flatMap((message, i) => {
                        const isMessageMy = message.fromId === authedUser?.id;
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
                                        icon: <DeleteOutlined/>,
                                        onClick: () => setInUpdateMessage(message.id),
                                        type: 'default',
                                    },
                                    {
                                        content: 'Delete',
                                        icon: <DeleteOutlined/>,
                                        onClick: () => dispatch(chatActions.messageDeleteAsync({messageId: message.id})),
                                        type: 'danger',
                                    },
                                ]}
                            >
                                <div
                                    className={[s.message, isMessageMy ? s.messageMy : null].join(' ')}
                                    // ref={ref => {
                                    //     if (message.id === firstMessageId) {
                                    //         // @ts-ignore
                                    //         firstMessageRef.current = ref;
                                    //     }
                                    // }}
                                >
                                    <div className={s.messageText}>{message.text}</div>
                                    <div className={s.messageInfo}>
                                        {message.createdAt !== message.updatedAt &&
                                            <div className={['small', s.small].join(' ')}>Edited</div>}
                                        <div
                                            className={['small', s.small].join(' ')}>{getTimeWithoutSeconds(new Date(message.createdAt))}</div>
                                        {isMessageMy && <Checks double={!!message.readMessages?.length}/>}
                                    </div>
                                </div>
                            </ContextMenu>
                        )
                        return returnJsx;
                    })}
                </div>
                <div ref={bottomOfMessagesRef}/>
            </div>
            <SendMessageForm scrollToBottom={scrollToBottom} inputTextRef={inputTextRef}/>
        </div>
    );
};