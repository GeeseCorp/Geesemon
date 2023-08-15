import React, { FC, MouseEventHandler, useState } from 'react';
import s from './HeaderButton.module.scss';
import { AnimationControls, motion, TargetAndTransition, Transition, VariantLabels } from 'framer-motion';
import ReactNode from 'react';

type Props = {
    keyName: string;
    children: React.ReactNode;
    onClick?: MouseEventHandler | undefined;
    borderRadius?: string;
    className?: string;
};
export const HeaderButton: FC<Props> = ({ children, onClick, keyName: key, borderRadius = '50px', className }) => {
  const animate: AnimationControls | TargetAndTransition | VariantLabels = {
    scale: [0.8, 1],
    rotate: [180, 360],
  };

  const transition: Transition = {
    duration: 0.3,
    ease: 'easeInOut',
  };

  const whileTap: VariantLabels | TargetAndTransition = { scale: 0.9 };

  return (
    <motion.div
      onClick={onClick}
      className={[s.wrapperButton, className].join(' ')}
      style={{ borderRadius }}
      key={key}
      animate={animate}
      transition={transition}
      whileTap={whileTap}
    >
      {children}
    </motion.div>
  );
};

type Props1 = {
    children?: React.ReactNode;
    buttonText: string;
    type: 'default' | 'danger';
};

export const FooterButton = ({ children, buttonText, type }: Props1) => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div>
      <button onClick={() => setIsVisible(prev => !prev)}>{buttonText}</button>
      {isVisible && (
        children
      )}

    </div>
  );
};