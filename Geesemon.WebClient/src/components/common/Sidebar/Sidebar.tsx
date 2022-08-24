import React, {FC, useState} from 'react';
import s from './Sidebar.module.css';
import {Chats} from "../../chats/Chats/Chats";
import {AnimatePresence, motion} from "framer-motion";
import menu from "../../../assets/svg/menu.svg";
import search from "../../../assets/svg/search.svg";
import back from "../../../assets/svg/back.svg";

type Props = {};
export const Sidebar: FC<Props> = ({}) => {
    const [isEnabledSearchMode, setIsEnabledSearchMode] = useState(false);
    const [inputSearchFocused, setInputSearchFocused] = useState(false);

    const onInputSearchFocus = () => {
        setInputSearchFocused(true)
        setIsEnabledSearchMode(true)
    }

    const onInputSearchBlur = () => {
        setInputSearchFocused(false)
    }

    return (
        <div className={s.wrapper}>
            <div className={s.header}>
                <div className={s.wrapperExtraButton}>
                    <AnimatePresence>
                        {isEnabledSearchMode
                            ? <motion.div
                                onClick={() => setIsEnabledSearchMode(false)}
                                className={s.extraButton}
                                key={'back'}
                                animate={{
                                    scale: [0.5, 1],
                                    rotate: [180, 360],
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                whileHover={{
                                    backgroundColor: 'rgba(128,128,128, 0.3)',
                                    opacity: 0.5,
                                    transition: {duration: 0.5},
                                }}
                                whileTap={{scale: 0.9}}
                            >
                                <img
                                    src={back}
                                    width={25}
                                />
                            </motion.div>
                            : <motion.div
                                className={s.extraButton}
                                key={'menu'}
                                animate={{
                                    scale: [0.5, 1],
                                    rotate: [180, 360],
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                whileHover={{
                                    backgroundColor: 'rgba(128,128,128, 0.3)',
                                    opacity: 0.5,
                                    transition: {duration: 0.5},
                                }}
                                whileTap={{scale: 0.9}}
                            >
                                <img
                                    src={menu}
                                    width={25}
                                />
                            </motion.div>
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
            <Chats/>
        </div>
    );
};