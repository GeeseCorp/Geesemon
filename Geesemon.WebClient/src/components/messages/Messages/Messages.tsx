import styles from './Messages.module.scss';
import stylesMessage from '../Message/Message.module.scss';
import React, { FC, useEffect, useRef, useState } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
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

import { InfinityScroll } from '../../common/InfinityScroll/InfinityScroll';
import { useOnUpdate } from '../../../hooks/useOnUpdate';

export const Messages: FC = () => {
    const selectedChatIdentifier = useSelectedChatIdentifier();
    const messageGetLoading = useAppSelector(s => s.chats.messageGetLoading);
    const messagesGetHasNext = useAppSelector(s => s.chats.messagesGetHasNext);
    const selectedChat = useSelectedChat();
    const dispatch = useAppDispatch();
    const inputTextRef = useRef<HTMLTextAreaElement | null>(null);
    const [messageBlocks, setMessageBlocks] = useState<MessageType[][]>([]);
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const messageBlocksRef = useRef<HTMLDivElement | null>(null);
    const scrollFromBottomPosition = useRef<number | null>(null);

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

    useOnUpdate(() => {
        if (scrollFromBottomPosition.current !== null && messageBlocksRef.current) {
            messageBlocksRef.current.scrollTop = scrollFromBottomPosition.current;
        }
    }, [messageBlocks]);

    // useEffect(() => {
    //     if (isAutoScroll) {
    //         console.log(isAutoScroll, 'scrollToBottom');
    //         scrollToBottom();
    //     }

    //     if (messageBlocks.length) {
    //         if (!isFirstTimeMessagesRendered) {
    //             setIsFirstTimeMessagesRendered(true);
    //             bottomOfMessagesRef.current?.scrollIntoView();
    //         }
    //     }
    // }, [messageBlocks]);

    useOnUpdate(() => {
        scrollToBottom();
    }, [selectedChatIdentifier]);

    useEffect(() => {
        dispatch(chatActions.setSelectedMessageIds([]));
    }, [selectedChat]);

    const scrollToBottom = () => {
        messageBlocksRef.current && (messageBlocksRef.current.scrollTop = 0);
    };

    const inputTextFocus = () => {
        inputTextRef.current?.focus();
    };

    const onReachTopHanlder = () => {
        console.log(selectedChat);
        if (selectedChat && !isGuidEmpty(selectedChat?.id)) {
            dispatch(chatActions.messageGetAsync({
                chatId: selectedChat?.id,
                skip: selectedChat?.messages.length,
                take: 30,
            }));
        }
    };

    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        scrollFromBottomPosition.current = element.scrollTop;
    };

    return (
        <div className={styles.wrapper}>
            {messageBlocks.length > 0 &&
                <div className={styles.wrapperMessagesBlocks} ref={messageBlocksRef} onScroll={onScroll}>
                    <InfinityScroll
                        className={styles.messagesBlocks}
                        items={messageBlocks}
                        onReachTop={onReachTopHanlder}
                        hasTopNext={messagesGetHasNext}
                        topLoading={messageGetLoading}
                        inverse
                        onItemRender={block => {
                            const blockFirstElement = block[0];
                            return (
                                <div key={blockFirstElement.id} className={styles.messagesBlock}>
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
                                    <div className={styles.innerMessagesBlock}>
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
                        }}
                    />
                </div>
            }
            <SendMessageForm scrollToBottom={scrollToBottom} inputTextRef={inputTextRef} />
        </div>
    );
};