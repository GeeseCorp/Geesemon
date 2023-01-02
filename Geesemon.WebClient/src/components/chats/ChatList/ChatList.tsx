import { useEffect, useRef, useState } from "react";
import { chatActions } from "../../../behavior/features/chats";
import { useAppDispatch, useAppSelector } from "../../../behavior/store";
import { useOnScreen } from "../../../hooks/useOnScreen";
import { Chat } from "../Chat/Chat";

type Props = {
    withSelected?: boolean;
    withMenu?: boolean;
    onClickChat: (chatUsername: string) => void;
};

export const ChatList = ({ withSelected = true, withMenu = true, onClickChat }: Props) => {
    const dispatch = useAppDispatch();
    const chats = useAppSelector(s => s.chats.chats);
    const chatsGetLoading = useAppSelector(s => s.chats.chatsGetLoading);
    const chatsGetHasNext = useAppSelector(s => s.chats.chatsGetHasNext);
    const [take] = useState(30);
    const lastChatRef = useRef<HTMLDivElement | null>(null);
    const isLastChatOnScreen = useOnScreen(lastChatRef);

    useEffect(() => {
        if (!chatsGetLoading && chatsGetHasNext && (!chats.length || isLastChatOnScreen)) {
            dispatch(chatActions.chatsGetAsync({ skip: chats.length, take }));
        }
    }, [isLastChatOnScreen]);

    return (
        <div>
            {chats.map((chat, i) => (
                <div
                    key={chat.id}
                    ref={el => {
                        if (i === chats.length - 1)
                            lastChatRef.current = el;
                    }}
                >
                    <Chat chat={chat} withSelected={withSelected} withMenu={withMenu} onClickChat={onClickChat}/>
                </div>
            ))}
        </div>
    )
}