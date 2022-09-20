import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from "../Menu/Menu";
import s from './ContextMenu.module.scss';

type Props = {
    items: MenuItem[],
    children: React.ReactElement,
};
export const ContextMenu: FC<Props> = ({ children, items }) => {
    const [open, setOpen] = useState(false);
    const [location, setLocation] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const onRightClick = (x: number, y: number) => {
        setOpen(true);
        setLocation({ x, y });
    };

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
        <>
            {React.cloneElement(children, {
                onContextMenu: (event: MouseEvent) => {
                    event.preventDefault();
                    onRightClick(event.clientX, event.clientY);
                },
            })}
            {open && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: .25 }}
                        className={s.menuItems}
                        ref={menuRef}
                        style={{
                            left: location.x,
                            top: location.y,
                        }}
                    >
                        {items.map((item, i) => {
                            const onClick = () => {
                                item.onClick && item.onClick();
                                setOpen(false)
                            }
                            if (item.link) {
                                return (
                                    <Link
                                        key={i}
                                        to={item.link}
                                    >
                                        <div
                                            key={i}
                                            onClick={() => setOpen(false)}
                                            className={[s.menuItem, item.type === 'danger' && 'danger'].join(' ')}
                                        >
                                            <div className={s.icon}>{item.icon}</div>
                                            <div className={s.content}>{item.content}</div>
                                        </div>
                                    </Link>
                                )
                            }
                            return (
                                <div
                                    key={i}
                                    onClick={onClick}
                                    className={[s.menuItem, item.type === 'danger' && 'danger'].join(' ')}
                                >
                                    <div className={s.icon}>{item.icon}</div>
                                    <div className={s.content}>{item.content}</div>
                                </div>
                            )
                        })}
                    </motion.div>
                </AnimatePresence>
            )}
        </>
    );
};