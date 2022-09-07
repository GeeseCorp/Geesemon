import {useAppDispatch, useAppSelector} from "../../../behavior/store";
import {Link, useParams} from "react-router-dom";
import s from './Chats.module.css';
import {AvatarWithoutImage} from "../../common/AvatarWithoutImage/AvatarWithoutImage";
import {getTimeWithoutSeconds} from "../../../utils/dateUtils";
import React, {FC, useEffect, useRef, useState} from "react";
import {chatActions} from "../../../behavior/features/chats";
import {ContextMenu} from "../../common/ContextMenu/ContextMenu";
import {DeleteOutlined} from "@ant-design/icons";
import {StrongButton} from "../../common/StrongButton/StrongButton";
import {Avatar} from "../../common/Avatar/Avatar";
import {appActions, LeftSidebarState} from "../../../behavior/app/slice";
import pencilFilled from '../../../assets/svg/pencilFilled.svg'
import {AnimatePresence} from "framer-motion";
import {HeaderButton} from "../../common/HeaderButton/HeaderButton";
import menu from "../../../assets/svg/menu.svg";
import {Menu, MenuItem} from "../../common/Menu/Menu";
import back from "../../../assets/svg/back.svg";
import {Search} from "../../common/formControls/Search/Search";
import saved from "../../../assets/svg/saved.svg";
import settings from "../../../assets/svg/settings.svg";

type Props = {}

export const Chats: FC<Props> = ({}) => {
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
            icon: <img src={saved} className={s.menuItem}/>,
            content: 'Saved',
            type: 'default',
            link: `/${authedUser?.id}`
        },
        {icon: <img src={settings} className={s.menuItem}/>, content: 'Settings', type: 'default'},
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
                                <img src={back} width={25}/>
                            </HeaderButton>
                            : <>
                                <HeaderButton key={'menu'} onClick={() => setIsMenuVisible(true)}>
                                    <img src={menu} width={20}/>
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
                                        icon: <DeleteOutlined/>,
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
                                                ? <Avatar imageUrl={chat.imageUrl}/>
                                                : <AvatarWithoutImage
                                                    name={chat.name || ''}
                                                    backgroundColor={chat.imageColor}
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
                        style={{left: `${offsetLeft + 325}px`}}
                    >
                        <StrongButton>
                            <img src={pencilFilled} width={20}/>
                        </StrongButton>
                    </div>
                </div>
            }
        </div>
    );
}
