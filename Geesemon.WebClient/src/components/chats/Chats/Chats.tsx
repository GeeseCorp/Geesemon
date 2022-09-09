import { AnimatePresence } from "framer-motion";
import { FC, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import back from "../../../assets/svg/back.svg";
import logout from "../../../assets/svg/logout.svg";
import menu from "../../../assets/svg/menu.svg";
import pencilFilled from '../../../assets/svg/pencilFilled.svg';
import saved from "../../../assets/svg/saved.svg";
import settings from "../../../assets/svg/settings.svg";
import deleteSvg from "../../../assets/svg/delete.svg";
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
import { Menu, MenuItem } from "../../common/Menu/Menu";
import { SmallPrimaryButton } from "../../common/SmallPrimaryButton/SmallPrimaryButton";
import s from './Chats.module.css';

type Props = {}

export const Chats: FC<Props> = ({ }) => {
    const [isEnabledSearchMode, setIsEnabledSearchMode] = useState(false);
    const authedUser = useAppSelector(s => s.auth.authedUser)
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const leftSidebarState = useAppSelector(s => s.app.leftSidebarState)
    const params = useParams()
    const chatId = params.chatId;
    const chats = useAppSelector(s => s.chats.chats);
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useAppDispatch();
    const chatsRef = useRef<HTMLDivElement>(null)
    const [offsetLeft, setOffsetLeft] = useState(0);

    useEffect(() => {
        if (!chats.length)
            dispatch(chatActions.getAsync());
    }, [])

    useEffect(() => {
        function handleResize() {
            setOffsetLeft(chatsRef.current?.getBoundingClientRect().left || 0)
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    })

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
            icon: <img src={logout} className={s.menuItem} />,
            content: 'Logout',
            onClick: () => dispatch(authActions.logout()),
            type: 'default'
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
                                        x={20}
                                        y={50}
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
                : <div className={s.chats} ref={chatsRef}>
                    {chats.slice(0).reverse().map(chat => {
                        const lastMessage = chat.messages?.length ? chat.messages?.reduce((a, b) => a.createdAt > b.createdAt ? a : b, chat.messages[0]) : null;
                        return (
                            <ContextMenu
                                key={chat.id}
                                items={[
                                    {
                                        content: 'Delete chat',
                                        icon: <img src={deleteSvg} width={20}/>,
                                        // onClick: () => dispatch(),
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
                    <div
                        className={s.buttonCreateChat}
                        onClick={() => dispatch(appActions.setLeftSidebarState(LeftSidebarState.CreateGroup))}
                        style={{ left: `${offsetLeft + 325}px` }}
                    >
                        <SmallPrimaryButton>
                            <img src={pencilFilled} width={20} />
                        </SmallPrimaryButton>
                    </div>
                </div>
            }
        </div>
    );
}
