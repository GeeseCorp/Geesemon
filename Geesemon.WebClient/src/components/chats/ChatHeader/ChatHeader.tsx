import React, { FC } from 'react';
import s from './ChatHeader.module.scss';
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../behavior/store";
import { Avatar } from "../../common/Avatar/Avatar";
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import { useIsMobile } from "../../../hooks/useIsMobile";
import { HeaderButton } from "../../common/HeaderButton/HeaderButton";
import back from "../../../assets/svg/back.svg";
import search from "../../../assets/svg/search.svg";
import threeDots from "../../../assets/svg/threeDots.svg";
import { appActions } from '../../../behavior/features/app/slice';
import { ChatKind } from '../../../behavior/features/chats/types';
import { OnlineIndicator } from '../../common/OnlineIndicator/OnlineIndicator';

type Props = {};
export const ChatHeader: FC<Props> = ({ }) => {
    const isMobile = useIsMobile()
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const params = useParams();
    const chatId = params.chatId;
    const isRightSidebarVisible = useAppSelector(s => s.app.isRightSidebarVisible);
    const chat = useAppSelector(s => s.chats.chats.find(c => c.id === chatId));
    const authedUser = useAppSelector(s => s.auth.authedUser);

    const oppositeUser = chat?.type === ChatKind.Personal ? chat.users.filter(u => u.id !== authedUser?.id)[0] : null;
    const isOnline = chat?.type === ChatKind.Personal && oppositeUser?.isOnline
    const lastTimeOnline = chat?.type === ChatKind.Personal && oppositeUser?.lastTimeOnline

    return (
        <div className={[s.wrapper, 'header'].join(' ')}>
            <div className={s.backAndChatInfo}>
                {isMobile &&
                    <HeaderButton keyName={'back'} onClick={() => navigate(-1)}>
                        <img src={back} width={25} className={'secondaryTextSvg'} />
                    </HeaderButton>
                }
                <div
                    className={s.chatInfo}
                    onClick={() => dispatch(appActions.setIsRightSidebarVisible(!isRightSidebarVisible))}
                >
                    {chat?.imageUrl
                        ? <Avatar
                            width={42}
                            height={42}
                            imageUrl={chat.imageUrl}
                        />
                        : <AvatarWithoutImage
                            name={chat?.name || ''}
                            backgroundColor={chat?.imageColor}
                            width={42}
                            height={42}
                        />
                    }
                    <div>
                        <div className={['bold', s.name].join(' ')}>{chat?.name}</div>
                        <div className={'small secondary'}>{isOnline ? 'Online' : lastTimeOnline}</div>
                    </div>
                </div>
            </div>
            <div className={s.extraButtons}>
                <HeaderButton keyName={'ContentBar/ChatHeader/Search'}>
                    <img src={search} width={20} className={'secondaryTextSvg'} />
                </HeaderButton>
                <HeaderButton keyName={'ContentBar/ChatHeader/ThreeDots'}>
                    <img src={threeDots} width={25} className={'secondaryTextSvg'} />
                </HeaderButton>
            </div>
        </div>
    );
};