import React, {FC, MouseEventHandler} from 'react';
import s from './HeaderButton.module.css';
import {AnimationControls, motion, TargetAndTransition, Transition, VariantLabels} from "framer-motion";

type Props = {
    key: string
    children: React.ReactNode
    onClick?: MouseEventHandler | undefined
    borderRadius?: string
};
export const HeaderButton: FC<Props> = ({children, onClick, key, borderRadius = '50px'}) => {
    const animate: AnimationControls | TargetAndTransition | VariantLabels = {
        scale: [0.8, 1],
        rotate: [180, 360],
    }

    const transition: Transition = {
        duration: 0.3,
        ease: "easeInOut",
    }

    const whileHover: VariantLabels | TargetAndTransition = {
        backgroundColor: 'rgba(128,128,128, 0.3)',
        transition: {duration: 0.5},
    }
    const whileTap: VariantLabels | TargetAndTransition = {scale: 0.9};

    return (
        <motion.div
            onClick={onClick}
            className={s.wrapperButton}
            style={{borderRadius}}
            key={key}
            animate={animate}
            transition={transition}
            whileHover={whileHover}
            whileTap={whileTap}
        >
            {children}
        </motion.div>
    );
};