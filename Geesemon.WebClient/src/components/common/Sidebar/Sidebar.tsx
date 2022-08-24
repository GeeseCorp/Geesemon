import React, {FC, useState} from 'react';
import s from './Sidebar.module.css';
import {Chats} from "../../chats/Chats/Chats";
import {
    AnimatePresence,
    AnimationControls,
    motion,
    TargetAndTransition,
    Transition,
    VariantLabels
} from "framer-motion";
import menu from "../../../assets/svg/menu.svg";
import search from "../../../assets/svg/search.svg";
import back from "../../../assets/svg/back.svg";

export const Sidebar: FC = () => {
    const [isEnabledSearchMode, setIsEnabledSearchMode] = useState(false);
    const [inputSearchFocused, setInputSearchFocused] = useState(false);

    const onInputSearchFocus = () => {
        setInputSearchFocused(true)
        setIsEnabledSearchMode(true)
    }

    const onInputSearchBlur = () => {
        setInputSearchFocused(false)
    }

    const animate: AnimationControls | TargetAndTransition | VariantLabels = {
        scale: [0.5, 1],
        rotate: [180, 360],
    }

    const transition: Transition = {
        duration: 0.3,
        ease: "easeInOut",
    }

    const whileHover: VariantLabels | TargetAndTransition = {
        backgroundColor: 'rgba(128,128,128, 0.3)',
        opacity: 0.5,
        transition: {duration: 0.5},
    }
    const whileTap: VariantLabels | TargetAndTransition = {scale: 0.9};

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
                                animate={animate}
                                transition={transition}
                                whileHover={whileHover}
                                whileTap={whileTap}
                            >
                                <img src={back} width={25}/>
                            </motion.div>
                            : <motion.div
                                className={s.extraButton}
                                key={'menu'}
                                animate={animate}
                                transition={transition}
                                whileHover={whileHover}
                                whileTap={whileTap}
                            >
                                <img src={menu} width={25}/>
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
            {isEnabledSearchMode
                ? null
                : <Chats/>
            }
        </div>
    );
};