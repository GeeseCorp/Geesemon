import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { RightSidebarState } from '../../../behavior/features/app/slice';
import { useAppSelector } from '../../../behavior/store';
import { ChatProfile } from '../../chats/ChatProfile/ChatProfile';
import { ChatsUpdateGroup } from '../../chats/ChatsUpdateGroup/ChatsUpdateGroup';
import s from './RightSidebar.module.scss';

export const RightSidebar: FC = () => {
    const isRightSidebarVisible = useAppSelector(s => s.app.isRightSidebarVisible);
    const rightSidebarState = useAppSelector(s => s.app.rightSidebarState);
    const params = useParams();
    const chatUsername = params.chatUsername as string;
    const chat = useAppSelector(s => s.chats.chats.find(c => c.username === chatUsername));
    const chatByUsername = useAppSelector(s => s.chats.chatByUsername);
    const selectedChat = chat || chatByUsername;

    if (!selectedChat)
        return null;

    const renderContent = () => {
        switch (rightSidebarState) {
            case RightSidebarState.Profile:
                return <ChatProfile chat={selectedChat} />;
            case RightSidebarState.UpdateGroup:
                return <ChatsUpdateGroup chat={selectedChat} />;
        }
    };

    return (
        <AnimatePresence>
            {isRightSidebarVisible &&
                <motion.div
                  className={s.wrapper}
                  initial={{ width: '0' }}
                  exit={{ width: '0' }}
                  animate={{ width: '400px' }}
                >
                    <div className={s.inner}>
                        {renderContent()}
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    );
};