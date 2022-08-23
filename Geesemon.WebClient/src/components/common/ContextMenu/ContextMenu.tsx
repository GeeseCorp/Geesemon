import React, {FC, useEffect, useRef, useState} from 'react';
import s from './ContextMenu.module.css';

type Props = {
    items: {
        icon?: React.ReactNode,
        content: React.ReactNode,
        onClick?: () => void,
        type: 'default' | 'danger'
    }[],
    children: React.ReactElement,
};
export const ContextMenu: FC<Props> = ({items, children}) => {
    const [open, setOpen] = useState(false);
    const [location, setLocation] = useState<{ x: number, y: number }>({x: 0, y: 0});
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

    const onRightClick = (x: number, y: number) => {
        setOpen(true);
        setLocation({x, y});
    };

    return (
        <>
            {React.cloneElement(children, {
                onContextMenu: (event: MouseEvent) => {
                    event.preventDefault();
                    console.log(event)
                    onRightClick(event.clientX, event.clientY);
                },
            })}
            {open && (
                <div
                    className={s.menuItems}
                    ref={menu => {
                        if (menu) {
                            menuRef.current = menu;
                        }
                    }}
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
                        return (
                            <div key={i} onClick={onClick}
                                 className={[s.menuItem, item.type === 'danger' && 'danger'].join(' ')}>
                                <div className={s.icon}>{item.icon}</div>
                                <div className={s.content}>{item.content}</div>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    );
};