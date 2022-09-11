import React, {FC} from 'react';
import s from './ChatHeader.module.css';
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../behavior/store";
import {Avatar} from "../../common/Avatar/Avatar";
import {AvatarWithoutImage} from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import {useIsMobile} from "../../../hooks/useIsMobile";
import {HeaderButton} from "../../common/HeaderButton/HeaderButton";
import back from "../../../assets/svg/back.svg";
import search from "../../../assets/svg/search.svg";
import threeDots from "../../../assets/svg/threeDots.svg";
import {appActions} from "../../../behavior/app/slice";

type Props = {};
export const ChatHeader: FC<Props> = ({}) => {
    const isMobile = useIsMobile()
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const params = useParams();
    const chatId = params.chatId;
    const isRightSidebarVisible = useAppSelector(s => s.app.isRightSidebarVisible);
    const selectedChat = useAppSelector(s => s.chats.chats.find(c => c.id === chatId));
    return (
        <div className={[s.wrapper, 'header'].join(' ')}>
            <div className={s.backAndChatInfo}>
                {isMobile &&
                    <HeaderButton key={'back'} onClick={() => navigate(-1)}>
                        <img src={back} width={25}/>
                    </HeaderButton>
                }
                <div
                    className={s.chatInfo}
                    onClick={() => dispatch(appActions.setIsRightSidebarVisible(!isRightSidebarVisible))}
                >
                    {selectedChat?.imageUrl
                        ? <Avatar
                            width={40}
                            height={40}
                            imageUrl={selectedChat.imageUrl}
                        />
                        : <AvatarWithoutImage
                            name={selectedChat?.name || ''}
                            backgroundColor={selectedChat?.imageColor}
                            width={40}
                            height={40}
                        />
                    }
                    <div className={'bold'}>{selectedChat?.name}</div>
                </div>
            </div>
            <div className={s.extraButtons}>
                <HeaderButton key={'ContentBar/ChatHeader/Search'}>
                    <img src={search} width={20}/>
                </HeaderButton>
                <HeaderButton key={'ContentBar/ChatHeader/ThreeDots'}>
                    <img src={threeDots} width={25}/>
                </HeaderButton>
            </div>
        </div>
    );
};