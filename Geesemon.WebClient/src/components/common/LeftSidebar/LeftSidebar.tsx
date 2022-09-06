import React, {FC, useState} from 'react';
import s from './LeftSidebar.module.css';
import {Chats} from "../../chats/Chats/Chats";
import {AnimatePresence} from "framer-motion";
import menu from "../../../assets/svg/menu.svg";
import search from "../../../assets/svg/search.svg";
import back from "../../../assets/svg/back.svg";
import saved from "../../../assets/svg/saved.svg";
import settings from "../../../assets/svg/settings.svg";
import {Menu, MenuItem} from "../Menu/Menu";
import {HeaderButton} from "../HeaderButton/HeaderButton";
import {useAppSelector} from "../../../behavior/store";

export const LeftSidebar: FC = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isEnabledSearchMode, setIsEnabledSearchMode] = useState(false);
    const [inputSearchFocused, setInputSearchFocused] = useState(false);
    const authedUser = useAppSelector(s => s.auth.authedUser)

    const onInputSearchFocus = () => {
        setInputSearchFocused(true)
        setIsEnabledSearchMode(true)
    }

    const onInputSearchBlur = () => {
        setInputSearchFocused(false)
    }

    const menuItems: MenuItem[] = [
        {icon: <img src={saved} className={s.menuItem}/>, content: 'Saved', type: 'default', link: `/${authedUser?.id}`},
        {icon: <img src={settings} className={s.menuItem}/>, content: 'Settings', type: 'default'},
    ];

    return (
        <div className={s.wrapper}>
            <div className={[s.header, 'header'].join(' ')}>
                <div className={s.wrapperExtraButton}>
                    <AnimatePresence>
                        {isEnabledSearchMode
                            ? <HeaderButton key={'back'} onClick={() => {
                                setIsEnabledSearchMode(false)
                                console.log('click1')
                            }}>
                                <img src={back} width={25}/>
                            </HeaderButton>
                            : <>
                                <HeaderButton key={'menu'} onClick={() => {
                                    setIsMenuVisible(true)
                                    console.log('click2')
                                }}>
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
                <div className={[s.wrapperInputSearch, inputSearchFocused && s.focused].join(' ')}>
                    <img src={search} width={20}/>
                    <input
                        placeholder={'Search'}
                        className={s.inputSearch}
                        onFocus={onInputSearchFocus}
                        onBlur={onInputSearchBlur}
                    />
                </div>
            </div>
            {isEnabledSearchMode
                ? null
                : <Chats/>
            }
        </div>
    );
};