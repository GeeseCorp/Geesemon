import React, {FC} from 'react';
import s from './ChatInfo.module.css';
import {Link, useNavigate, useParams} from "react-router-dom";
import {useAppSelector} from "../../../behavior/store";
import {Avatar} from "../../common/Avatar/Avatar";
import {AvatarWithoutImage} from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import {useIsMobile} from "../../../hooks/useIsMobile";
import {HeaderButton} from "../../common/HeaderButton/HeaderButton";
import back from "../../../assets/svg/back.svg";

type Props = {};
export const ChatInfo: FC<Props> = ({}) => {
    const isMobile = useIsMobile()
    const navigate = useNavigate();
    const params = useParams();
    const chatId = params.chatId;
    const selectedChat = useAppSelector(s => s.chats.chats.find(c => c.id === chatId));
    const parts = selectedChat?.name?.split(' ')[0] || [];
    const firstName = parts.length ? parts[0] : '';
    const lastName = parts.length > 1 ? parts[1] : '';

    return (
        <div className={s.wrapper}>
            {isMobile &&
                <HeaderButton key={'back'} onClick={() => navigate(-1)}>
                    <img src={back} width={25}/>
                </HeaderButton>
            }
            <div className={s.inner}>
                <Link to={''}>
                    <div className={s.chatInfo}>
                        {selectedChat?.imageUrl
                            ? <Avatar
                                width={40}
                                height={40}
                                imageUrl={selectedChat.imageUrl}
                            />
                            : <AvatarWithoutImage
                                firstName={firstName}
                                lastName={lastName}
                                backgroundColor={selectedChat?.imageUrl}
                                width={40}
                                height={40}
                            />
                        }
                        <div className={'bold'}>{selectedChat?.name}</div>
                    </div>
                </Link>
            </div>
        </div>
    );
};