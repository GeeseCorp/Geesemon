import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useEffect, useState } from 'react';
import s from './RightSidebar.module.scss';
import { useAppDispatch, useAppSelector } from "../../../behavior/store";
import { HeaderButton } from "../HeaderButton/HeaderButton";
import crossFilled from "../../../assets/svg/crossFilled.svg";
import atSign from "../../../assets/svg/atSign.svg";
import notificationOutlinedSvg from "../../../assets/svg/notificationOutlined.svg";
import { useParams } from "react-router-dom";
import { AvatarWithoutImage } from "../AvatarWithoutImage/AvatarWithoutImage";
import { appActions } from '../../../behavior/features/app/slice';
import { ChatKind } from '../../../behavior/features/chats/types';
import { User } from '../../users/User/User';
import { Notification } from '../../../behavior/features/notifications/slice';
import { Switch } from '../formControls/Switch/Switch';

export enum Tab {
    Members = 'Members',
    Files = 'Files',
    Voice = 'Voice',
}

type Props = {};
export const RightSidebar: FC<Props> = ({ }) => {
    const isRightSidebarVisible = useAppSelector(s => s.app.isRightSidebarVisible)
    const dispatch = useAppDispatch();
    const params = useParams();
    const chatId = params.chatId as string;
    const selectedChat = useAppSelector(s => s.chats.chats.find(c => c.id === chatId));
    const [selectedTab, setSelectedTab] = useState(Tab.Members);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
    const [isEnabledNotifications, setIsEnabledNotifications] = useState<boolean>(false)

    useEffect(() => {
        if (selectedTab === Tab.Members && (selectedChat?.type === ChatKind.Personal || selectedChat?.type === ChatKind.Saved))
            setSelectedTab(Tab.Files)
    }, [selectedChat])

    const renderTab = () => {
        switch (selectedTab) {
            case Tab.Members:
                return selectedChat?.users.map(user => (
                    <User
                        user={user}
                        selectedUserIds={selectedUserIds}
                        setSelectedUserIds={setSelectedUserIds}
                    />
                ))
            default:
                null;
        }
    }

    if (!selectedChat)
        return null;

    return (
        <AnimatePresence>
            {isRightSidebarVisible &&
                <motion.div
                    className={s.wrapper}
                    initial={{ width: '0' }}
                    exit={{ width: '0' }}
                    animate={{ width: '400px' }}
                >
                    <div className={['header', s.header].join(' ')}>
                        <HeaderButton
                            keyName={'RightSidebar/Close'}
                            onClick={() => dispatch(appActions.setIsRightSidebarVisible(false))}
                        >
                            <img src={crossFilled} width={15} />
                        </HeaderButton>
                        <div className={'headerTitle'}>Profile</div>
                    </div>
                    <div className={s.chatInfo}>
                        <div className={s.imageAndName}>
                            {selectedChat?.imageUrl
                                ? <div className={s.wrapperAvatar}>
                                    <img src={selectedChat.imageUrl} className={s.avatar} />
                                    <div className={s.name}>{selectedChat.name}</div>
                                </div>
                                : <>
                                    <AvatarWithoutImage
                                        name={selectedChat?.name || ''}
                                        backgroundColor={selectedChat?.imageColor}
                                        width={100}
                                        height={100}
                                    />
                                    <div className={s.avatarWithoutImageName}>{selectedChat.name}</div>
                                </>
                            }
                        </div>
                        <div className={s.chatInfoButtons}>
                            <div className={s.chatInfoButton}>
                                <img src={atSign} width={25} />
                                <div>
                                    {/* TODO add username on server */}
                                    <div className={s.chatInfoButtonText}>{selectedChat.name}</div>
                                    <div className={s.chatInfoButtonLabel}>username</div>
                                </div>
                            </div>
                            <div className={s.chatInfoButton}>
                                <img src={notificationOutlinedSvg} width={25} />
                                <div>
                                    <div className={s.chatInfoButtonText}>Notifications</div>

                                </div>
                            </div>
                        </div>
                        {/* <Switch
                            checked={isEnabledNotifications}
                            setChecked={setIsEnabledNotifications}
                        /> */}
                        <div className={s.divider}></div>
                        <div className={s.tabs}>
                            {(Object.keys(Tab) as Array<Tab>).map((tab) =>
                                (selectedChat.type === ChatKind.Personal || selectedChat.type === ChatKind.Saved) && tab === Tab.Members
                                    ? null
                                    : (
                                        <div
                                            className={[s.tab, tab === selectedTab && s.tabSelected].join(' ')}
                                            onClick={() => setSelectedTab(tab)}
                                        >
                                            {tab}
                                        </div>
                                    )
                            )}
                        </div>
                        <div className={s.tabContent}>{renderTab()}</div>
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    );
};