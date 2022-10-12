import React, { FC } from 'react';
import { motion } from 'framer-motion';

type Props = {

};
export const SmallLoading: FC<Props> = ({}) => {
    const LoadingDot = {
        display: 'block',
        width: '5px',
        height: '5px',
        backgroundColor: 'white',
        borderRadius: '50%',
    };

    const LoadingContainer = {
        width: '20px',
        height: '5px',
        display: 'flex',
        justifyContent: 'space-around',
    };

    const ContainerVariants = {
        initial: {
            transition: {
                staggerChildren: 0.2,
            },
        },
        animate: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const DotVariants = {
        initial: {
            y: '0%',
        },
        animate: {
            y: '100%',
        },
    };

    const DotTransition = {
        duration: 0.5,
        yoyo: Infinity,
        ease: 'easeInOut',
    };

    return (
        <motion.div
          style={LoadingContainer}
          variants={ContainerVariants}
          initial="initial"
          animate="animate"
        >
            <motion.span
              style={LoadingDot}
              variants={DotVariants}
              transition={DotTransition}
            />
            <motion.span
              style={LoadingDot}
              variants={DotVariants}
              transition={DotTransition}
            />
            <motion.span
              style={LoadingDot}
              variants={DotVariants}
              transition={DotTransition}
            />
        </motion.div>
    );
};