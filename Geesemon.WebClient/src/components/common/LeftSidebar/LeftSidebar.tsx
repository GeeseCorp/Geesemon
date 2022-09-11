import React, { FC } from 'react';
import s from './LeftSidebar.module.css';
import { Chats } from "../../chats/Chats/Chats";
import { useAppSelector } from "../../../behavior/store";
import { ChatsCreateGroup } from "../../chats/ChatsCreateGroup/ChatsCreateGroup";
import { LeftSidebarState } from '../../../behavior/features/app/slice';

export const LeftSidebar: FC = () => {
    const leftSidebarState = useAppSelector(s => s.app.leftSidebarState)

    const renderContent = () => {
        switch (leftSidebarState) {
            case LeftSidebarState.Chats:
                return <Chats />;
            case LeftSidebarState.CreateGroup:
                return <ChatsCreateGroup />;
        }
    }

    return (
        <div className={s.wrapper}>
            {renderContent()}
        </div>
    );
};