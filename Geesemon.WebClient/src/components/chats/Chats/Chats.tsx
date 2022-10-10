import { AnimatePresence } from "framer-motion";
import { FC, useEffect, useState } from "react";
import back from "../../../assets/svg/back.svg";
import crossFilled from "../../../assets/svg/crossFilled.svg";
import logout from "../../../assets/svg/logout.svg";
import menu from "../../../assets/svg/menu.svg";
import pencilFilled from '../../../assets/svg/pencilFilled.svg';
import saved from "../../../assets/svg/saved.svg";
import settings from "../../../assets/svg/settings.svg";
import personSvg from "../../../assets/svg/person.svg";
import { appActions, LeftSidebarState } from "../../../behavior/features/app/slice";
import { authActions } from "../../../behavior/features/auth/slice";
import { chatActions } from "../../../behavior/features/chats";
import { useAppDispatch, useAppSelector } from "../../../behavior/store";
import { Search } from "../../common/formControls/Search/Search";
import { HeaderButton } from "../../common/HeaderButton/HeaderButton";
import { LeftSidebarSmallPrimaryButton } from "../../common/LeftSidebarSmallPrimaryButton/LeftSidebarSmallPrimaryButton";
import { Menu, MenuItem } from "../../common/Menu/Menu";
import { SmallLoading } from "../../common/SmallLoading/SmallLoading";
import { SmallPrimaryButton } from "../../common/SmallPrimaryButton/SmallPrimaryButton";
import { Chat } from "../Chat/Chat";
import s from './Chats.module.scss';

type Props = {}

export const Chats: FC<Props> = ({ }) => {
    const [isEnabledSearchMode, setIsEnabledSearchMode] = useState(false);
    const logoutLoading = useAppSelector(s => s.auth.logoutLoading)
    const authedUser = useAppSelector(s => s.auth.authedUser)
    const [isMenuVisible, setIsMenuVisible] = useState(false);
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
            icon: <img src={saved} className={[s.menuItem, 'secondaryTextSvg'].join(' ')} />,
            content: 'Saved',
            type: 'default',
            link: `/${authedUser?.id}`
        },
        {
            icon: <img src={settings} className={[s.menuItem, 'secondaryTextSvg'].join(' ')} />,
            content: 'Settings',
            type: 'default'
        },
        {
            icon: logoutLoading ? <SmallLoading /> : <img src={logout} className={[s.menuItem, 'secondaryTextSvg'].join(' ')} />,
            content: 'Logout',
            onClick: () => dispatch(authActions.logoutAsync()),
            type: 'default'
        },
    ];

    const createChatMenuItems: MenuItem[] = [
        {
            icon: <img src={personSvg} className={[s.menuItem, 'secondaryTextSvg'].join(' ')} />,
            content: 'New group',
            type: 'default',
            onClick: () => dispatch(appActions.setLeftSidebarState(LeftSidebarState.CreateGroupChat)),
        },
        {
            icon: <img src={personSvg} className={[s.menuItem, 'secondaryTextSvg'].join(' ')} />,
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
                                keyName={'back'}
                                onClick={() => setIsEnabledSearchMode(false)}
                            >
                                <img src={back} width={25} className={'secondaryTextSvg'}/>
                            </HeaderButton>
                            : <>
                                <HeaderButton keyName={'menu'} onClick={() => setIsMenuVisible(true)}>
                                    <img src={menu} width={20} className={'secondaryTextSvg'} />
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
                    {chats.map(chat => <Chat key={chat.id} chat={chat} />)}
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
                                    ? <img src={crossFilled} width={15} className={'primaryTextSvg'} />
                                    : <img src={pencilFilled} width={25} className={'primaryTextSvg'} />}
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
