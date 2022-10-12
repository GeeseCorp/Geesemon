import { useState } from 'react';

export const useModal = () => {
    const [opened, setOpened] = useState(false);
    const hide = () => setOpened(false);
    const show = () => setOpened(true);
    const toggle = () => setOpened(!opened);
    return {
        opened,
        hide,
        show,
        toggle,
    };
};