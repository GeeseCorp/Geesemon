import {AnimatePresence, motion} from 'framer-motion';
import React, {Dispatch, FC, useEffect, useRef} from 'react';
import s from "./Menu.module.css";

export type MenuItem = {
    icon?: React.ReactNode,
    content: React.ReactNode,
    onClick?: () => void,
    type: 'default' | 'danger'
}

type Props = {
    items: MenuItem[],
    x: number,
    y: number,
    setOpen: Dispatch<React.SetStateAction<boolean>>
};
export const Menu: FC<Props> = ({items, x, y, setOpen}) => {
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        document.addEventListener('mousedown', onClickOff);
        return () => {
            document.removeEventListener('mousedown', onClickOff);
        }
    }, [])

    const onClickOff = (event: MouseEvent) => {
        if (event.target !== menuRef.current && !menuRef.current?.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0, scale: 0.5}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.5}}
                transition={{duration: .25}}
                className={s.menuItems}
                ref={menu => {
                    if (menuRef)
                        menuRef.current = menu
                }}
                style={{
                    left: x,
                    top: y,
                }}
            >
                {items.map((item, i) => {
                    const onClick = () => {
                        item.onClick && item.onClick();
                        setOpen(false)
                    }
                    return (
                        <div key={i} onClick={onClick}
                             className={[s.menuItem, item.type === 'danger' && 'danger'].join(' ')}>
                            <div className={s.icon}>{item.icon}</div>
                            <div className={s.content}>{item.content}</div>
                        </div>
                    )
                })}
            </motion.div>
        </AnimatePresence>
    );
};