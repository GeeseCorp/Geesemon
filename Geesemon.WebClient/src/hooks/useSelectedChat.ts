import { useParams } from 'react-router-dom';
import { useAppSelector } from '../behavior/store';

export const useSelectedChat = () => {
    const selectedUsername = useSelectedChatUsername();
    const chat = useAppSelector(s => s.chats.chats.find(c => c.username === selectedUsername));
    const chatByUsername = useAppSelector(s => s.chats.chatByUsername);
    return chat || chatByUsername;
};

export const useSelectedChatUsername = () => {
    const params = useParams();
    return params.chatUsername;
};
