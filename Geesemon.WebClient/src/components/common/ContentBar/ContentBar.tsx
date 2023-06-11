import { FC, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { chatActions } from '../../../behavior/features/chats';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useSelectedChatIdentifier } from '../../../hooks/useSelectedChat';
import { ChatHeader } from '../../chats/ChatHeader/ChatHeader';
import { Messages } from '../../messages/Messages/Messages';
import { ViewMessageReadByModal } from '../../messages/ViewMessageReadByModal/ViewMessageReadByModal';
import { SelectChatForForwardMessagesModal } from '../../messages/SelectChatForForwardMessagesModal/SelectChatForForwardMessagesModal';
import s from './ContentBar.module.scss';

export const ContentBar: FC = () => {
    const selectedChatIdentifier = useSelectedChatIdentifier();
    const dispatch = useAppDispatch();
    const chats = useAppSelector(c => c.chats.chats);
    const chat = chats.find(c => c.identifier === selectedChatIdentifier);
    const chatsGetLoading = useAppSelector(c => c.chats.chatsGetLoading);
    const chatByIdentifier = useAppSelector(c => c.chats.chatByIdentifier);
    const chatGetByIdentifierLoading = useAppSelector(c => c.chats.chatGetByIdentifierLoading);

    const [items, setItems] = useState(Array.from({ length: 20 }));
    const [hasMore, setHasMore] = useState(true);

    const style = {
        height: 30,
        border: '1px solid green',
        margin: 6,
        padding: 8,
    };

    const fetchMoreData = () => {
        if (items.length >= 100) {
            setHasMore(false);
            return;
        }
        setTimeout(() => {
            setItems(items.concat(Array.from({ length: 20 })));
        }, 500);
    };

    useEffect(() => {
        if (selectedChatIdentifier && !chat && !chatsGetLoading && !chatGetByIdentifierLoading) {
            console.log('req');
            dispatch(chatActions.chatGetByIdentifierAsync(selectedChatIdentifier));
        }
    }, [selectedChatIdentifier]);

    useEffect(() => {
        if (chats.find(c => c.identifier === selectedChatIdentifier) && chatByIdentifier) {
            dispatch(chatActions.updateChat(chatByIdentifier));
            dispatch(chatActions.setChatByIdentifier(null));
        }
    }, [chats]);

    return (
        <div className={s.wrapper}>
            <ViewMessageReadByModal />
            <SelectChatForForwardMessagesModal />
            {selectedChatIdentifier
                ? (
                    <>
                        <ChatHeader />
                        <Messages />

                        {/* <InfiniteScroll
                          dataLength={items.length}
                          next={fetchMoreData}
                          hasMore={hasMore}
                          loader={<h4>Loading...</h4>}
                          height={400}
                          inverse
                          style={{ display: 'flex', flexDirection: 'column-reverse' }}
                          endMessage={(
                            <p style={{ textAlign: 'center' }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                          )}
                        >
                        {items.map((i, index) => (
                            <div style={style} key={index}>
                            div - #{index}
                            </div>
                        ))}
                        </InfiniteScroll> */}
                    </>
                )
                : <div className={'center'}>Select a chat</div>}
        </div>
    );
};