import React, { FC, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { chatActions } from '../../../behavior/features/chats';
import { ChatKind, Message as MessageType } from '../../../behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useSelectedChat, useSelectedChatUsername } from '../../../hooks/useSelectedChat';
import { Avatar } from '../../common/Avatar/Avatar';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import { Message } from '../Message/Message';
import { SendMessageForm } from '../SendMessageForm/SendMessageForm';
import s from './Messages.module.scss';
import { isGuidEmpty } from '../../../utils/stringUtils';

export const Messages: FC = () => {
    const selectedChatUsername = useSelectedChatUsername();
    const messageGetLoading = useAppSelector(s => s.chats.messageGetLoading);
    const selectedChat = useSelectedChat();
    const dispatch = useAppDispatch();
    const [isAutoScroll, setIsAutoScroll] = useState(false);
    const bottomOfMessagesRef = useRef<HTMLDivElement>(null);
    const inputTextRef = useRef<HTMLTextAreaElement | null>(null);
    const [messageBlocks, setMessageBlocks] = useState<MessageType[][]>([]);
    const authedUser = useAppSelector(s => s.auth.authedUser);

    useEffect(() => {
        if(selectedChat?.messages) {
            const blocks: MessageType[][] = [];
            let block: MessageType[] = [];
            selectedChat?.messages.forEach((message, i) => {
                if(i === selectedChat?.messages.length - 1) {
                    if(i !== 0 && message.fromId !== selectedChat?.messages[i - 1].fromId){
                        blocks.push(block);
                        block = [];
                    }
                    block.push(message);
                    blocks.push(block);
                }
                else if(i === 0 || message.fromId === selectedChat?.messages[i - 1].fromId) {
                    block.push(message);
                }
                else {
                    blocks.push(block);
                    block = [];
                    block.push(message);
                }
            });
            setMessageBlocks(blocks);
        }
    }, [selectedChat?.messages]);

    useEffect(() => {
        if (isAutoScroll) {
            console.log(isAutoScroll, 'scrollToBottom');
            scrollToBottom();
        }
    }, [messageBlocks]);

    useEffect(() => {
        bottomOfMessagesRef.current?.scrollIntoView();
    }, [selectedChatUsername]);

    const onScrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        const scrollPosition = Math.abs(element.scrollHeight - element.scrollTop) - element.clientHeight;
        if (scrollPosition < 70)
            !isAutoScroll && setIsAutoScroll(true);
        else
            isAutoScroll && setIsAutoScroll(false);

        if (element.scrollTop < 100 && !messageGetLoading && selectedChat && !isGuidEmpty(selectedChat?.id)) {
            dispatch(chatActions.messageGetAsync({
                chatId: selectedChat?.id,
                skip: selectedChat?.messages.length,
            }));
        }
    };

    const scrollToBottom = () => {
        bottomOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const onSetInUpdateMessage = () => {
        inputTextRef.current?.focus();
    };

    return (
        <div className={s.wrapper}>
            <div className={s.messages} onScroll={onScrollHandler}>
                {messageBlocks.map((block, i) => {
                    const blockFirstElement = block[0];
                    return (
                        <div key={i} className={s.messagesBlock}>
                            {blockFirstElement.fromId && blockFirstElement.fromId !== authedUser?.id && selectedChat?.type === ChatKind.Group && (
                                <Link to={`/${blockFirstElement.from?.username}`}>
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
                            <div className={s.wrapperMessage}>
                                {block.map((message, j) => (
                                    <Message 
                                      key={message.id}
                                      isFromVisible={!j && selectedChat?.type === ChatKind.Group && message.fromId !== authedUser?.id}
                                      message={message} 
                                      onSetInUpdateMessage={onSetInUpdateMessage}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomOfMessagesRef} />
            </div>
            <SendMessageForm scrollToBottom={scrollToBottom} inputTextRef={inputTextRef} />
        </div>
    );
};