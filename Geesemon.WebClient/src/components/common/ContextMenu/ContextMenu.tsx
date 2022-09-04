import React, {FC, useEffect, useRef, useState} from 'react';
import {Menu, MenuItem} from "../Menu/Menu";

type Props = {
    items: MenuItem[],
    children: React.ReactElement,
};
export const ContextMenu: FC<Props> = ({children, items}) => {
    const [open, setOpen] = useState(false);
    const [location, setLocation] = useState<{ x: number, y: number }>({x: 0, y: 0});

    const onRightClick = (x: number, y: number) => {
        setOpen(true);
        setLocation({x, y});
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
                <Menu
                    items={items}
                    x={location.x}
                    y={location.y}
                    setOpen={setOpen}
                />
            )}
        </>
    );
};