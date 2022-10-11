import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../behavior/store';
import s from './RightSidebar.module.scss';

import { ChatProfile } from '../../chats/ChatProfile/ChatProfile';
import { RightSidebarState } from '../../../behavior/features/app/slice';
import { ChatsUpdateGroup } from '../../chats/ChatsUpdateGroup/ChatsUpdateGroup';

export const RightSidebar: FC = () => {
    const isRightSidebarVisible = useAppSelector(s => s.app.isRightSidebarVisible);
    const rightSidebarState = useAppSelector(s => s.app.rightSidebarState);
    const params = useParams();
    const chatUsername = params.chatUsername as string;
    const selectedChat = useAppSelector(s => s.chats.chats.find(c => c.username === chatUsername));

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