import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';
import { RightSidebarState } from '../../../behavior/features/app/slice';
import { useAppSelector } from '../../../behavior/store';
import { useSelectedChat } from '../../../hooks/useSelectedChat';
import { ChatProfile } from '../../chats/ChatProfile/ChatProfile';
import { ChatsUpdateGroup } from '../../chats/ChatsUpdateGroup/ChatsUpdateGroup';
import s from './RightSidebar.module.scss';
import { ChatsAddMembers } from '../../chats/ChatsAddMembers/ChatsAddMembers';

export const RightSidebar: FC = () => {
    const isRightSidebarVisible = useAppSelector(s => s.app.isRightSidebarVisible);
    const rightSidebarState = useAppSelector(s => s.app.rightSidebarState);
    const selectedChat = useSelectedChat();

    if (!selectedChat)
        return null;

    const renderContent = () => {
        switch (rightSidebarState) {
            case RightSidebarState.Profile:
                return <ChatProfile chat={selectedChat} />;
            case RightSidebarState.UpdateGroup:
                return <ChatsUpdateGroup chat={selectedChat} />;
            case RightSidebarState.GroupAddMembers:
                return <ChatsAddMembers />;
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