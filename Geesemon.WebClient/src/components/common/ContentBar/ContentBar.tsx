import { FC, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { chatActions } from '../../../behavior/features/chats';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useSelectedChatUsername } from '../../../hooks/useSelectedChat';
import { ChatHeader } from '../../chats/ChatHeader/ChatHeader';
import { Messages } from '../../messages/Messages/Messages';
import { ViewMessageReadByModal } from '../../messages/ViewMessageReadByModal/ViewMessageReadByModal';
import s from './ContentBar.module.scss';

export const ContentBar: FC = () => {
    const selectedChatUsername = useSelectedChatUsername();
    const dispatch = useAppDispatch();
    const chats = useAppSelector(c => c.chats.chats);
    const chat = chats.find(c => c.username === selectedChatUsername);
    const chatsGetLoading = useAppSelector(c => c.chats.chatsGetLoading);
    const chatByUsername = useAppSelector(c => c.chats.chatByUsername);
    const chatGetByUsernameLoading = useAppSelector(c => c.chats.chatGetByUsernameLoading);

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
        if(selectedChatUsername && !chat && !chatsGetLoading && !chatGetByUsernameLoading){
            console.log('req');
            dispatch(chatActions.chatGetByUsernameAsync(selectedChatUsername));
        }
    }, [selectedChatUsername]);
   
    useEffect(() => {
        if(chats.find(c => c.username === selectedChatUsername) && chatByUsername){
            dispatch(chatActions.updateChat(chatByUsername));
            dispatch(chatActions.setChatByUsername(null));
        }
    }, [chats]);
 
    return (
        <div className={s.wrapper}>
            <ViewMessageReadByModal />
            {selectedChatUsername
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