import { AnimatePresence } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import back from "../../../assets/svg/back.svg";
import deleteSvg from "../../../assets/svg/delete.svg";
import logout from "../../../assets/svg/logout.svg";
import menu from "../../../assets/svg/menu.svg";
import pencilFilled from '../../../assets/svg/pencilFilled.svg';
import saved from "../../../assets/svg/saved.svg";
import settings from "../../../assets/svg/settings.svg";
import crossFilled from "../../../assets/svg/crossFilled.svg";
import { appActions, LeftSidebarState } from "../../../behavior/features/app/slice";
import { authActions } from "../../../behavior/features/auth/slice";
import { chatActions } from "../../../behavior/features/chats";
import { useAppDispatch, useAppSelector } from "../../../behavior/store";
import { getTimeWithoutSeconds } from "../../../utils/dateUtils";
import { Avatar } from "../../common/Avatar/Avatar";
import { AvatarWithoutImage } from "../../common/AvatarWithoutImage/AvatarWithoutImage";
import { ContextMenu } from "../../common/ContextMenu/ContextMenu";
import { Search } from "../../common/formControls/Search/Search";
import { HeaderButton } from "../../common/HeaderButton/HeaderButton";
import { LeftSidebarSmallPrimaryButton } from "../../common/LeftSidebarSmallPrimaryButton/LeftSidebarSmallPrimaryButton";
import { Menu, MenuItem } from "../../common/Menu/Menu";
import { SmallLoading } from "../../common/SmallLoading/SmallLoading";
import { SmallPrimaryButton } from "../../common/SmallPrimaryButton/SmallPrimaryButton";
import s from './Chats.module.css';

type Props = {}

export const Chats: FC<Props> = ({ }) => {
    const [isEnabledSearchMode, setIsEnabledSearchMode] = useState(false);
    const logoutLoading = useAppSelector(s => s.auth.logoutLoading)
    const authedUser = useAppSelector(s => s.auth.authedUser)
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const leftSidebarState = useAppSelector(s => s.app.leftSidebarState)
    const params = useParams()
    const chatId = params.chatId;
    const chats = useAppSelector(s => s.chats.chats);
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useAppDispatch();
    const [isCreateChatMenuVisible, setIsCreateChatMenuVisible] = useState(false);

    useEffect(() => {
        if (!chats.length)
            dispatch(chatActions.chatsGetAsync());
    }, [])

    const menuItems: MenuItem[] = [
        {
            icon: <img src={saved} className={s.menuItem} />,
            content: 'Saved',
            type: 'default',
            link: `/${authedUser?.id}`
        },
        {
            icon: <img src={settings} className={s.menuItem} />,
            content: 'Settings',
            type: 'default'
        },
        {
            icon: logoutLoading ? <SmallLoading /> : <img src={logout} className={s.menuItem} />,
            content: 'Logout',
            onClick: () => dispatch(authActions.logoutAsync()),
            type: 'default'
        },
    ];

    const createChatMenuItems: MenuItem[] = [
        {
            icon: <img src={saved} className={s.menuItem} />,
            content: 'New group',
            type: 'default',
            onClick: () => dispatch(appActions.setLeftSidebarState(LeftSidebarState.CreateGroupChat)),
        },
        {
            icon: <img src={saved} className={s.menuItem} />,
            content: 'New personal chat',
            type: 'default',
            onClick: () => dispatch(appActions.setLeftSidebarState(LeftSidebarState.CreatePersonalChat)),
        },
    ];

    return (
        <div className={s.wrapper}>
            <div className={['header', s.header].join(' ')}>
                <div className={s.wrapperExtraButton}>
                    <AnimatePresence>
                        {isEnabledSearchMode
                            ? <HeaderButton
                                key={'back'}
                                onClick={() => setIsEnabledSearchMode(false)}
                            >
                                <img src={back} width={25} />
                            </HeaderButton>
                            : <>
                                <HeaderButton key={'menu'} onClick={() => setIsMenuVisible(true)}>
                                    <img src={menu} width={20} />
                                </HeaderButton>
                                {isMenuVisible &&
                                    <Menu
                                        items={menuItems}
                                        top={50}
                                        setOpen={setIsMenuVisible}
                                    />
                                }
                            </>
                        }
                    </AnimatePresence>
                </div>
                <Search
                    value={searchValue}
                    setValue={setSearchValue}
                    onFocus={() => setIsEnabledSearchMode(true)}
                />
            </div>
            {isEnabledSearchMode
                ? <div>search</div>
                : <div className={s.chats}>
                    {chats.map(chat => {
                        const lastMessage = chat.messages?.length ? chat.messages?.reduce((a, b) => a.createdAt > b.createdAt ? a : b, chat.messages[0]) : null;
                        return (
                            <ContextMenu
                                key={chat.id}
                                items={[
                                    {
                                        content: 'Delete chat',
                                        icon: <img src={deleteSvg} width={20} />,
                                        onClick: () => dispatch(chatActions.chatDeleteAsync(chat.id)),
                                        type: 'danger',
                                    },
                                ]}
                            >
                                <div className={[s.chat, chat.id === chatId ? s.chatSelected : null].join(' ')}>
                                    <Link
                                        to={`/${chat.id}`}
                                        className={s.chatLink}
                                    >
                                        <div className={s.chatInner}>
                                            {chat.imageUrl
                                                ? <Avatar imageUrl={chat.imageUrl} width={54} height={54} />
                                                : <AvatarWithoutImage
                                                    name={chat.name || ''}
                                                    backgroundColor={chat.imageColor}
                                                    width={54}
                                                    height={54}
                                                />
                                            }
                                            <div className={s.chatInfo}>
                                                <div className={'bold'}>{chat.name}</div>
                                                <div
                                                    className={['secondary light', s.chatLastMessage].join(' ')}>{lastMessage?.text}</div>
                                            </div>
                                            <div
                                                className={'small light'}>{lastMessage && getTimeWithoutSeconds(new Date(lastMessage.createdAt))}</div>
                                        </div>
                                    </Link>
                                </div>
                            </ContextMenu>
                        )
                    })}
                    <LeftSidebarSmallPrimaryButton>
                        <div
                            className={s.smallPrimaryButton}
                            onClick={isCreateChatMenuVisible
                                ? () => setIsCreateChatMenuVisible(false)
                                : () => setIsCreateChatMenuVisible(true)
                            }

                        >
                            <SmallPrimaryButton>
                                {isCreateChatMenuVisible
                                    ? <img src={crossFilled} width={20} />
                                    : <img src={pencilFilled} width={20} />}
                            </SmallPrimaryButton>
                            {isCreateChatMenuVisible &&
                                <Menu
                                    items={createChatMenuItems}
                                    top={-90}
                                    right={0}
                                    setOpen={setIsCreateChatMenuVisible}
                                />
                            }
                        </div>
                    </LeftSidebarSmallPrimaryButton>
                </div >
            }
        </div >
    );
}
