import { useParams } from 'react-router-dom';
import { useAppSelector } from '../behavior/store';

export const useSelectedChat = () => {
    const selectedIdentifier = useSelectedChatIdentifier();
    const chat = useAppSelector(s => s.chats.chats.find(c => c.identifier === selectedIdentifier));
    const chatByIdentifier = useAppSelector(s => s.chats.chatByIdentifier);
    return chat || chatByIdentifier;
};

export const useSelectedChatIdentifier = () => {
    const params = useParams();
    return params.chatIdentifier;
};
