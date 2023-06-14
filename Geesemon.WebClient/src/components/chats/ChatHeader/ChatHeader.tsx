import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backSvg from '../../../assets/svg/back.svg';
import searchSvg from '../../../assets/svg/search.svg';
import threeDotsSvg from '../../../assets/svg/threeDots.svg';
import deleteSvg from '../../../assets/svg/delete.svg';
import pinSvg from '../../../assets/svg/pin.svg';
import notificationOutlinedSvg from '../../../assets/svg/notificationOutlined.svg';
import exitSvg from '../../../assets/svg/exit.svg';
import { appActions } from '../../../behavior/features/app/slice';
import { ChatKind } from '../../../behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useSelectedChat, useSelectedChatIdentifier } from '../../../hooks/useSelectedChat';
import { getLastTimeActivity } from '../../../utils/dateUtils';
import { Avatar } from '../../common/Avatar/Avatar';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import s from './ChatHeader.module.scss';
import { ContextMenu } from '../../common/ContextMenu/ContextMenu';
import { Menu, MenuItem } from '../../common/Menu/Menu';
import { chatActions } from '../../../behavior/features/chats';

export const ChatHeader: FC = () => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isRightSidebarVisible = useAppSelector(s => s.app.isRightSidebarVisible);
    const selectedChat = useSelectedChat();
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const [isCreateChatMenuVisible, setIsCreateChatMenuVisible] = useState(false);

    const oppositeUser = selectedChat?.type === ChatKind.Personal ? selectedChat.users.filter(u => u.id !== authedUser?.id)[0] : null;
    const isOnline = selectedChat?.type === ChatKind.Personal && oppositeUser?.isOnline;
    const lastTimeOnline = selectedChat?.type === ChatKind.Personal && oppositeUser?.lastTimeOnline;

    const renderActivity = () => {
        switch (selectedChat?.type) {
            case ChatKind.Personal:
                return <div className={'subText'}>{isOnline ? 'Online' : lastTimeOnline && getLastTimeActivity(new Date(lastTimeOnline))}</div>;
            case ChatKind.Group:
                return <div className={'subText'}>{selectedChat.membersTotal} members{selectedChat.membersOnline > 1 ? `, ${selectedChat.membersOnline} online` : ''}</div>;
            default:
                return null;
        }
    };

    const menuItems: MenuItem[] = [
        {
            content: 'Leave chat',
            icon: <img src={exitSvg} width={20} className={'primaryTextSvg'} alt={'exitSvg'} />,
            onClick: () => {
                dispatch(chatActions.leaveChatAsync({ chatId: selectedChat?.id! }));
                navigate('/');
            },
            type: 'default',
        },
    ];

    if(!selectedChat)
        return null;

    return (
        <div className={[s.wrapper, 'header'].join(' ')}>
            <div className={s.backAndChatInfo}>
                {isMobile &&
                    <HeaderButton keyName={'back'} onClick={() => navigate(-1)}>
                        <img src={backSvg} width={25} className={'secondaryTextSvg'} alt={'backSvg'} />
                    </HeaderButton>
                }
                <div
                  className={s.chatInfo}
                  onClick={() => dispatch(appActions.setIsRightSidebarVisible(!isRightSidebarVisible))}
                >
                    {selectedChat?.imageUrl
                        ? (
                            <Avatar
                              width={42}
                              height={42}
                              imageUrl={selectedChat.imageUrl}
                            />
                        )
                        : (
                            <AvatarWithoutImage
                              name={selectedChat?.name || ''}
                              backgroundColor={selectedChat?.imageColor}
                              width={42}
                              height={42}
                            />
                        )
                    }
                    <div>
                        <div className={['bold', s.name].join(' ')}>{selectedChat?.name}</div>
                        {renderActivity()}
                    </div>
                </div>
            </div>
            <div className={s.extraButtons}>
                <HeaderButton keyName={'ContentBar/ChatHeader/Search'}>
                    <img src={searchSvg} width={20} className={'secondaryTextSvg'} alt={'searchSvg'} />
                </HeaderButton>
                <HeaderButton keyName={'ContentBar/ChatHeader/ThreeDots'} onClick={() => setIsCreateChatMenuVisible(!isCreateChatMenuVisible)}>
                    <img src={threeDotsSvg} width={25} className={'secondaryTextSvg'} alt={'threeDotsSvg'} />
                    {isCreateChatMenuVisible &&
                        <Menu
                          items={menuItems}
                          top={50}
                          right={-20}
                          setOpen={setIsCreateChatMenuVisible}
                        />
                    }
                </HeaderButton>
            </div>
        </div>
    );
};