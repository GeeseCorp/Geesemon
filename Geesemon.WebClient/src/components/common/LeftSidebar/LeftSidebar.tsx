import { FC, useEffect, useRef, useState } from 'react';
import { LeftSidebarState } from '../../../behavior/features/app/slice';
import { useAppSelector } from '../../../behavior/store';
import { Chats } from '../../chats/Chats/Chats';
import { ChatsCreateGroup as ChatsCreateGroupChat } from '../../chats/ChatsCreateGroup/ChatsCreateGroup';
import { ChatsCreatePersonalChat } from '../../chats/ChatsCreatePersonalChat/ChatsCreatePersonalChat';
import { Settings } from '../../settings/Settings/Settings';
import s from './LeftSidebar.module.scss';

export const leftSidebarSmallPrimaryButtonId = 'leftSidebarSmallPrimaryButtonId';
export const getLeftSidebarSmallPrimaryButtonElement = () => document.getElementById(leftSidebarSmallPrimaryButtonId);

export const LeftSidebar: FC = () => {
    const leftSidebarState = useAppSelector(s => s.app.leftSidebarState);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleResize() {
            setOffsetLeft(wrapperRef.current?.getBoundingClientRect().left || 0);
        }

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const renderContent = () => {
        switch (leftSidebarState) {
            case LeftSidebarState.Chats:
                return <Chats />;
            case LeftSidebarState.CreateGroupChat:
                return <ChatsCreateGroupChat />;
            case LeftSidebarState.CreatePersonalChat:
                return <ChatsCreatePersonalChat />;
            case LeftSidebarState.Settings:
                return <Settings />;
        }
    };

    return (
        <div className={s.wrapper} ref={wrapperRef}>
            {renderContent()}
            <div
              id={leftSidebarSmallPrimaryButtonId}
              className={s.leftSidebarSmallPrimaryButton}
              style={{ left: `${offsetLeft + 340}px` }}
            />
        </div>
    );
};