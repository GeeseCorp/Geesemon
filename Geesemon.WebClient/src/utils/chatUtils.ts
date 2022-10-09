import { Chat } from "../behavior/features/chats";

export const sortChat = (chats: Chat[]): Chat[] => {
    return chats.sort((a, b) => {
        const aTimeLastMessage = new Date(a.messages.length ? a.messages[a.messages.length - 1].createdAt : a.createdAt).getTime()
        const bTimeLastMessage = new Date(b.messages.length ? b.messages[b.messages.length - 1].createdAt : b.createdAt).getTime();
        return bTimeLastMessage - aTimeLastMessage;
    });
}

export const shallowUpdateChat = (oldChat: Chat, newChat: Chat): Chat => {
    oldChat.id = newChat.id;
    oldChat.name = newChat.name;
    oldChat.type = newChat.type;
    oldChat.imageUrl = newChat.imageUrl;
    oldChat.imageColor = newChat.imageColor;
    oldChat.membersTotal = newChat.membersTotal;
    oldChat.membersOnline = newChat.membersOnline;
    oldChat.creatorId = newChat.creatorId;
    oldChat.createdAt = newChat.createdAt;
    oldChat.updatedAt = newChat.updatedAt;
    return oldChat;
}