import { FC, useEffect, useState } from 'react';
import atSignSvg from '../../../assets/svg/atSign.svg';
import crossFilledSvg from '../../../assets/svg/crossFilled.svg';
import notificationOutlinedSvg from '../../../assets/svg/notificationOutlined.svg';
import pencilOutlinedSvg from '../../../assets/svg/pencilOutlined.svg';
import { appActions, RightSidebarState } from '../../../behavior/features/app/slice';
import { Chat } from '../../../behavior/features/chats';
import { ChatKind } from '../../../behavior/features/chats/types';
import { useAppDispatch } from '../../../behavior/store';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import { Switch } from '../../common/formControls/Switch/Switch';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import { User } from '../../users/User/User';
import s from './ChatProfile.module.scss';
import { useNavigate } from 'react-router-dom';
import { User as UserType } from '../../../behavior/features/users/types';
import { ProfileButton } from '../../common/ProfileButton/ProfileButton';

export enum Tab {
    Members = 'Members',
    Files = 'Files',
    Voice = 'Voice',
}

type Props = {
    chat: Chat;
};

export const ChatProfile: FC<Props> = ({ chat }) => {
    const [isEnabledNotifications, setIsEnabledNotifications] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState(Tab.Members);
    const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedTab === Tab.Members && (chat.type === ChatKind.Personal || chat.type === ChatKind.Saved))
            setSelectedTab(Tab.Files);
        else if (selectedTab !== Tab.Members && !(chat.type === ChatKind.Personal || chat.type === ChatKind.Saved))
            setSelectedTab(Tab.Members);
    }, [chat]);

    const setSelectedUsersHandler = (users: UserType[]) => {
        setSelectedUsers(users);
        navigate(`/${users[0].username}`);
        dispatch(appActions.setIsRightSidebarVisible(false));
    };

    const renderTab = () => {
        switch (selectedTab) {
            case Tab.Members:
                return chat?.users.map(user => (
                    <User
                      key={user.id}
                      user={user}
                      selectedUsers={selectedUsers}
                      setSelectedUsers={setSelectedUsersHandler}
                    />
                ));
            default:
                <></>;
        }
    };

    return (
        <div>
            <div className={['header', s.header].join(' ')}>
                <div className={s.headerCloseAndTitle}>
                    <HeaderButton
                      keyName={'RightSidebar/Close'}
                      onClick={() => dispatch(appActions.setIsRightSidebarVisible(false))}
                    >
                        <img src={crossFilledSvg} width={15} className={'secondaryTextSvg'} alt={'crossFilledSvg'} />
                    </HeaderButton>
                    <div className={'headerTitle'}>Profile</div>
                </div>
                {chat.type === ChatKind.Group &&
                    <HeaderButton
                      keyName={'RightSidebar/UpdateGroup'}
                      onClick={() => dispatch(appActions.setRightSidebarState(RightSidebarState.UpdateGroup))}
                    >
                        <img src={pencilOutlinedSvg} width={20} className={'secondaryTextSvg'} alt={'pencilOutlinedSvg'} />
                    </HeaderButton>
                }
            </div>
            <div className={s.chatInfo}>
                <div className={s.imageAndName}>
                    {chat?.imageUrl
                        ? (
                            <div className={s.wrapperAvatar}>
                                <img src={chat.imageUrl} className={s.avatar} alt={'imageUrl'} />
                                <div className={s.name}>{chat.name}</div>
                            </div>
                        )
                        : (
                            <>
                                <AvatarWithoutImage
                                  name={chat?.name || ''}
                                  backgroundColor={chat?.imageColor}
                                  width={100}
                                  height={100}
                                />
                                <div className={s.avatarWithoutImageName}>{chat.name}</div>
                            </>
                        )
                    }
                </div>
                <div className={s.chatProfileButtons}>
                    <ProfileButton 
                      icon={<img src={atSignSvg} width={25} className={'secondaryTextSvg'} alt={'atSignSvg'} />}
                      text={chat.username}
                      label={'Username'}
                    />
                    <ProfileButton 
                      icon={<img src={notificationOutlinedSvg} width={25} className={'secondaryTextSvg'} alt={'notificationOutlinedSvg'} />}
                      text={(
                        <div className={s.notifications}>
                            <div className={s.chatInfoButtonText}>Notifications</div>
                            <Switch
                              checked={isEnabledNotifications}
                              setChecked={setIsEnabledNotifications}
                            />
                        </div>
                      )}
                    />
                </div>

                <div className={'divider'} />
                <div className={s.tabs}>
                    {(Object.keys(Tab) as Array<Tab>).map(tab =>
                        (chat.type === ChatKind.Personal || chat.type === ChatKind.Saved) && tab === Tab.Members
                            ? null
                            : (
                                <div
                                  key={tab}
                                  className={[s.tab, tab === selectedTab && s.tabSelected].join(' ')}
                                  onClick={() => setSelectedTab(tab)}
                                >
                                    {tab}
                                </div>
                            ),
                    )}
                </div>
                <div className={s.tabContent}>{renderTab()}</div>
            </div>
        </div>
    );
};