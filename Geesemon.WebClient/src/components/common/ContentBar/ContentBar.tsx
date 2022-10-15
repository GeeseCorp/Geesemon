import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatHeader } from '../../chats/ChatHeader/ChatHeader';
import { Messages } from '../../messages/Messages/Messages';
import { ViewMessageReadByModal } from '../../messages/ViewMessageReadByModal/ViewMessageReadByModal';
import s from './ContentBar.module.scss';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { chatActions } from '../../../behavior/features/chats';
import { useSelectedChatUsername } from '../../../hooks/useSelectedChat';

export const ContentBar: FC = () => {
    const selectedChatUsername = useSelectedChatUsername();
    const dispatch = useAppDispatch();
    const chats = useAppSelector(c => c.chats.chats);
    const chat = chats.find(c => c.username === selectedChatUsername);
    const chatsGetLoading = useAppSelector(c => c.chats.chatsGetLoading);
    const chatByUsername = useAppSelector(c => c.chats.chatByUsername);
    const chatGetByUsernameLoading = useAppSelector(c => c.chats.chatGetByUsernameLoading);

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
                     </>
                )
                : <div className={'center'}>Select a chat</div>}
        </div>
    );
};