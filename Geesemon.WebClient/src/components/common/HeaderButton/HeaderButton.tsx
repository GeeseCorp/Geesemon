import React, {FC, MouseEventHandler} from 'react';
import s from './HeaderButton.module.css';
import {AnimationControls, motion, TargetAndTransition, Transition, VariantLabels} from "framer-motion";

type Props = {
    key: string
    children: React.ReactNode
    onClick?: MouseEventHandler | undefined;
};
export const HeaderButton: FC<Props> = ({children, onClick, key}) => {
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

    console.log('rerender')

    return (
        <motion.div
            onClick={onClick}
            className={s.wrapperButton}
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