import { FC } from 'react';
import { useParams } from "react-router-dom";
import { ChatHeader } from "../../chats/ChatHeader/ChatHeader";
import { Messages } from "../../messages/Messages/Messages";
import { ViewMessageReadByModal } from '../../messages/ViewMessageReadByModal/ViewMessageReadByModal';
import s from './ContentBar.module.css';

type Props = {};
export const ContentBar: FC<Props> = ({ }) => {
    const params = useParams();
    const chatId = params.chatId;

    return (
        <div className={s.wrapper}>
            <ViewMessageReadByModal />
            {chatId
                ? <>
                    <ChatHeader />
                    <Messages />
                </>
                : <div className={'center'}>Select a chat</div>}
        </div>
    );
};