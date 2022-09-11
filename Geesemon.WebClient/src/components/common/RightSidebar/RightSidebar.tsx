import {AnimatePresence, motion} from 'framer-motion';
import React, {FC} from 'react';
import s from './RightSidebar.module.css';
import {useAppDispatch, useAppSelector} from "../../../behavior/store";
import {HeaderButton} from "../HeaderButton/HeaderButton";
import crossFilled from "../../../assets/svg/crossFilled.svg";
import atSign from "../../../assets/svg/atSign.svg";
import {useParams} from "react-router-dom";
import {AvatarWithoutImage} from "../AvatarWithoutImage/AvatarWithoutImage";
import { appActions } from '../../../behavior/features/app/slice';

type Props = {};
export const RightSidebar: FC<Props> = ({}) => {
    const isRightSidebarVisible = useAppSelector(s => s.app.isRightSidebarVisible)
    const dispatch = useAppDispatch();
    const params = useParams();
    const chatId = params.chatId as string;
    const selectedChat = useAppSelector(s => s.chats.chats.find(c => c.id === chatId));

    if (!selectedChat)
        return null;

    return (
        <AnimatePresence>
            {isRightSidebarVisible &&
                <motion.div
                    className={s.wrapper}
                    initial={{width: '0'}}
                    exit={{width: '0'}}
                    animate={{width: '400px'}}
                >
                    <div className={['header', s.header].join(' ')}>
                        <HeaderButton
                            key={'RightSidebar/Close'}
                            onClick={() => dispatch(appActions.setIsRightSidebarVisible(false))}
                        >
                            <img src={crossFilled} width={15}/>
                        </HeaderButton>
                        <div className={'headerTitle'}>Profile</div>
                    </div>
                    <div className={s.chatInfo}>
                        <div className={s.imageAndName}>
                            {selectedChat?.imageUrl
                                ? <div className={s.wrapperAvatar}>
                                    <img src={selectedChat.imageUrl} className={s.avatar}/>
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
                            <HeaderButton key={'RightSidebar/ChatInfo/Username'} borderRadius={'10px'}>
                                <div className={s.chatInfoButton}>
                                    <img src={atSign} width={25}/>
                                    <div>
                                        {/* TODO add username on server */}
                                        <div className={s.chatInfoButtonText}>{selectedChat.name}</div>
                                        <div className={s.chatInfoButtonLabel}>username</div>
                                    </div>
                                </div>
                            </HeaderButton>
                        </div>
                        <div className={s.divider}></div>
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    );
};