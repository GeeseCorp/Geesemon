import { FC, useEffect, useRef, useState } from 'react';
import { LeftSidebarState } from '../../../behavior/features/app/slice';
import { useAppSelector } from "../../../behavior/store";
import { Chats } from "../../chats/Chats/Chats";
import { ChatsCreateGroup } from "../../chats/ChatsCreateGroup/ChatsCreateGroup";
import s from './LeftSidebar.module.css';

export const leftSidebarSmallPrimaryButtonId = 'leftSidebarSmallPrimaryButtonId';
export const getLeftSidebarSmallPrimaryButtonElement = () => document.getElementById(leftSidebarSmallPrimaryButtonId);

export const LeftSidebar: FC = () => {
    const leftSidebarState = useAppSelector(s => s.app.leftSidebarState)
    const [offsetLeft, setOffsetLeft] = useState(0);
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleResize() {
            setOffsetLeft(wrapperRef.current?.getBoundingClientRect().left || 0)
        }

        handleResize();
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const renderContent = () => {
        switch (leftSidebarState) {
            case LeftSidebarState.Chats:
                return <Chats />;
            case LeftSidebarState.CreateGroup:
                return <ChatsCreateGroup />;
        }
    }

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