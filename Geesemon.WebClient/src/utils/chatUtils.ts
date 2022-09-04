import {Chat} from "../behavior/features/chats";

export const sortChat = (chats: Chat[]): Chat[] => {
    return chats.sort((a, b) => {
        const aTimeLastMessage = new Date(a.messages.length ? a.messages[a.messages.length - 1].createdAt : a.createdAt).getTime()
        const bTimeLastMessage = new Date(b.messages.length ? b.messages[b.messages.length - 1].createdAt : b.createdAt).getTime();
        return aTimeLastMessage - bTimeLastMessage;
    });
}