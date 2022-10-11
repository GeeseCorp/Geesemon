import { FC } from 'react';
import { useParams } from "react-router-dom";
import { ChatHeader } from "../../chats/ChatHeader/ChatHeader";
import { Messages } from "../../messages/Messages/Messages";
import { ViewMessageReadByModal } from '../../messages/ViewMessageReadByModal/ViewMessageReadByModal';
import s from './ContentBar.module.css';

export const ContentBar: FC = () => {
    const params = useParams();
    const chatUsername = params.chatUsername;

    return (
        <div className={s.wrapper}>
            <ViewMessageReadByModal />
            {chatUsername
                ? <>
                    <ChatHeader />
                    <Messages />
                </>
                : <div className={'center'}>Select a chat</div>}
        </div>
    );
};