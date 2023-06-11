import React, { FC, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { chatActions } from '../../../behavior/features/chats';
import { ChatKind, Message as MessageType } from '../../../behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useSelectedChat, useSelectedChatIdentifier } from '../../../hooks/useSelectedChat';
import { isGuidEmpty } from '../../../utils/stringUtils';
import { Avatar } from '../../common/Avatar/Avatar';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import { Message } from '../Message/Message';
import { SendMessageForm } from '../SendMessageForm/SendMessageForm';
import s from './Messages.module.scss';

export const Messages: FC = () => {
    const selectedChatIdentifier = useSelectedChatIdentifier();
    const messageGetLoading = useAppSelector(s => s.chats.messageGetLoading);
    const messagesGetHasNext = useAppSelector(s => s.chats.messagesGetHasNext);
    const selectedChat = useSelectedChat();
    const dispatch = useAppDispatch();
    const [isAutoScroll, setIsAutoScroll] = useState(false);
    const bottomOfMessagesRef = useRef<HTMLDivElement>(null);
    const inputTextRef = useRef<HTMLTextAreaElement | null>(null);
    const [messageBlocks, setMessageBlocks] = useState<MessageType[][]>([]);
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const messageBlocksRef = useRef<HTMLDivElement | null>(null);
    const [isFirstTimeMessagesRendered, setIsFirstTimeMessagesRendered] = useState(false);

    useEffect(() => {
        const blocks: MessageType[][] = [];
        let block: MessageType[] = [];
        selectedChat?.messages.forEach((message, i) => {
            if (i === selectedChat?.messages.length - 1) {
                if (i !== 0 && message.fromId !== selectedChat?.messages[i - 1].fromId) {
                    blocks.push(block);
                    block = [];
                }
                block.push(message);
                blocks.push(block);
            }
            else if (i === 0 || message.fromId === selectedChat?.messages[i - 1].fromId) {
                block.push(message);
            }
            else {
                blocks.push(block);
                block = [];
                block.push(message);
            }
        });
        setMessageBlocks(blocks);
    }, [selectedChat?.messages]);

    useEffect(() => {
        if (isAutoScroll) {
            console.log(isAutoScroll, 'scrollToBottom');
            scrollToBottom();
        }

        if (messageBlocks.length) {
            if (!isFirstTimeMessagesRendered) {
                setIsFirstTimeMessagesRendered(true);
                bottomOfMessagesRef.current?.scrollIntoView();
            }
        }
    }, [messageBlocks]);

    useEffect(() => {
        bottomOfMessagesRef.current?.scrollIntoView();
    }, [selectedChatIdentifier]);

    useEffect(() => {
        dispatch(chatActions.setSelectedMessageIds([]));
    }, [selectedChat]);

    const onScrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        const scrollPosition = Math.abs(element.scrollHeight - element.scrollTop) - element.clientHeight;
        if (scrollPosition < 70)
            !isAutoScroll && setIsAutoScroll(true);
        else
            isAutoScroll && setIsAutoScroll(false);

        if (element.scrollTop < 250 && !messageGetLoading && selectedChat && !isGuidEmpty(selectedChat?.id)) {
            dispatch(chatActions.messageGetAsync({
                chatId: selectedChat?.id,
                skip: selectedChat?.messages.length,
                take: 30,
            }));
        }
    };

    const scrollToBottom = () => {
        bottomOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const inputTextFocus = () => {
        inputTextRef.current?.focus();
    };

    return (
        <div className={s.wrapper}>
            {messageBlocks.length > 0 &&
                <div id="wrapperMessagesBlocks" className={s.wrapperMessagesBlocks} onScroll={onScrollHandler} ref={messageBlocksRef}>
                    <InfiniteScroll
                        dataLength={messageBlocks.length}
                        next={() => null}
                        hasMore={messagesGetHasNext}
                        loader={<></>}
                        inverse
                        className={s.messagesBlocks}
                        scrollableTarget="wrapperMessagesBlocks"
                        initialScrollY={messageBlocksRef.current?.scrollHeight}
                    >
                        {/* {Array.from({ length: 100 }).map((_, i) => (
                            <div key={i}>{i}</div>
                        ))} */}
                        {messageBlocks.map(block => {
                            const blockFirstElement = block[0];
                            return (
                                <div key={blockFirstElement.id} className={s.messagesBlock}>
                                    {blockFirstElement.fromId && blockFirstElement.fromId !== authedUser?.id && selectedChat?.type === ChatKind.Group && (
                                        <Link to={`/${blockFirstElement.from?.identifier}`}>
                                            {blockFirstElement?.from?.imageUrl
                                                ? (
                                                    <Avatar
                                                        width={42}
                                                        height={42}
                                                        imageUrl={blockFirstElement?.from?.imageUrl}
                                                    />
                                                )
                                                : (
                                                    <AvatarWithoutImage
                                                        name={blockFirstElement?.from?.firstName + ' ' + blockFirstElement.from?.lastName}
                                                        backgroundColor={blockFirstElement.from?.avatarColor}
                                                        width={42}
                                                        height={42}
                                                    />
                                                )}
                                        </Link>
                                    )}
                                    <div className={s.innerMessagesBlock}>
                                        {block.map((message, j) => (
                                            <Message
                                                key={message.id}
                                                isFromVisible={j === block.length - 1 && selectedChat?.type === ChatKind.Group && message.fromId !== authedUser?.id}
                                                message={message}
                                                inputTextFocus={inputTextFocus}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </InfiniteScroll>
                    <div ref={bottomOfMessagesRef} />
                </div>
            }
            <SendMessageForm scrollToBottom={scrollToBottom} inputTextRef={inputTextRef} />
        </div>
    );
};