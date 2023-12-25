import { AnimatePresence, motion } from 'framer-motion';
import React, { Dispatch, FC, useEffect, useRef } from 'react';
import s from './Menu.module.scss';
import { Link } from 'react-router-dom';

export type MenuItem = {
  icon?: React.ReactNode | null;
  content: React.ReactNode;
  onClick?: () => void;
  type: 'default' | 'danger';
  link?: string;
  selected?: boolean;
};

type Props = {
  items: MenuItem[];
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  className?: string;
};

export const Menu: FC<Props> = ({ items, left, top, right, bottom, setOpen, className }) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener('mousedown', onClickOff);
    return () => {
      document.removeEventListener('mousedown', onClickOff);
    };
  }, []);

  const onClickOff = (event: MouseEvent) => {
    if (event.target !== menuRef.current && !menuRef.current?.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: .25 }}
        className={`${s.menuItems} ${className}`}
        ref={menuRef}
        style={{
          left,
          top,
          right,
          bottom,
        }}
      >
        {items.map((item, i) => {
          const onClick = () => {
            item.onClick && item.onClick();
            setOpen(false);
          };
          if (item.link) {
            return (
              <Link
                key={i}
                to={item.link}
              >
                <div
                  key={i}
                  onClick={() => setOpen(false)}
                  className={[s.menuItem, item.type === 'danger' && 'danger', item.selected ? s.selected : ''].join(' ')}
                >
                  <div className={s.icon}>{item.icon}</div>
                  <div className={s.content}>{item.content}</div>
                </div>
              </Link>
            );
          }
          return (
            <div
              key={i}
              onClick={onClick}
              className={[s.menuItem, item.type === 'danger' && 'danger', item.selected ? s.selected : ''].join(' ')}
            >
              <div className={s.icon}>{item.icon}</div>
              <div className={s.content}>{item.content}</div>
            </div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};
