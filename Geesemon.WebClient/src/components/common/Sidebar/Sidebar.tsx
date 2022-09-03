import React, {FC, useCallback, useEffect, useState} from 'react';
import s from './Sidebar.module.css';
import {Chats} from "../../chats/Chats/Chats";
import {AnimatePresence, motion, PanInfo, useMotionValue} from "framer-motion";
import menu from "../../../assets/svg/menu.svg";
import search from "../../../assets/svg/search.svg";
import back from "../../../assets/svg/back.svg";
import saved from "../../../assets/svg/saved.svg";
import settings from "../../../assets/svg/settings.svg";
import {Menu, MenuItem} from "../Menu/Menu";
import {useIsMobile} from "../../../hooks/useIsMobile";
import {HeaderButton} from "../HeaderButton/HeaderButton";

export const Sidebar: FC = () => {
    const isMobile = useIsMobile();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isEnabledSearchMode, setIsEnabledSearchMode] = useState(false);
    const [inputSearchFocused, setInputSearchFocused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const mWidth = useMotionValue(400);

    useEffect(() => {
        const updateSize = () => mWidth.set(window.innerWidth)

        if (isMobile) {
            window.addEventListener('resize', updateSize);
            updateSize();
        } else {
            window.removeEventListener('resize', updateSize);
        }
        return () => window.removeEventListener('resize', updateSize);
    }, [isMobile])

    const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        let newWidth = mWidth.get() + info.delta.x;
        if (newWidth > 300 && newWidth < 700) {
            mWidth.set(mWidth.get() + info.delta.x);
        }
    }, []);

    const onInputSearchFocus = () => {
        setInputSearchFocused(true)
        setIsEnabledSearchMode(true)
    }

    const onInputSearchBlur = () => {
        setInputSearchFocused(false)
    }

    const menuItems: MenuItem[] = [
        {icon: <img src={saved} className={s.menuItem}/>, content: 'Saved', type: 'default'},
        {icon: <img src={settings} className={s.menuItem}/>, content: 'Settings', type: 'default'},
    ];

    return (
        <div className={s.wrapper}>
            <motion.div
                style={{width: mWidth}}
                className={s.inner}
            >
                <div className={s.header}>
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
                    : <Chats leftOffsetForButtonCreate={mWidth}/>
                }
            </motion.div>
            {!isMobile &&
                <motion.div
                    className={s.sidebarResizer}
                    drag="x"
                    dragConstraints={{top: 0, left: 0, right: 0, bottom: 0}}
                    dragElastic={0}
                    dragMomentum={false}
                    onDrag={handleDrag}
                    onDragEnd={() => setIsDragging(false)}
                    onDragStart={() => setIsDragging(true)}
                />
            }
        </div>
    );
};