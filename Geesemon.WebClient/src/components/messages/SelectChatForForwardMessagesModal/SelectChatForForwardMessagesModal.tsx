import crossFilledSvg from '../../../assets/svg/crossFilled.svg';
import { chatActions } from '../../../behavior/features/chats';
import { usersActions } from '../../../behavior/features/users/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import { Modal } from '../../common/Modal/Modal';
import { User } from '../../users/User/User';
import { Checks } from '../Checks/Checks';
import styles from './SelectChatForForwardMessagesModal.module.scss';
import { navigateActions } from '../../../behavior/features/navigate/slice';
import { User as UserType } from '../../../behavior/features/users/types';
import { Mode } from '../../../behavior/features/chats/slice';
import { useRef } from 'react';
import { useOnScreen } from '../../../hooks/useOnScreen';
import { ChatList } from '../../chats/ChatList/ChatList';

export const SelectChatForForwardMessagesModal = () => {
    const forwardMessages = useAppSelector(s => s.chats.forwardMessages);
    const mode = useAppSelector(s => s.chats.mode);

    const dispatch = useAppDispatch();

    const onScrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        // const element = e.currentTarget;
        // if (element.scrollHeight - element.clientHeight - element.scrollTop < 70 && !readByGetLoading && readByHasNext && inViewMessageIdReadBy && inViewMessageReadBy) {
        //     dispatch(chatActions.readByGetAsync({
        //         messageId: inViewMessageIdReadBy,
        //         take: readByTake,
        //         skip: inViewMessageReadBy?.readBy.length,
        //     }));
        // }
    };

    const closeHanlder = () => {
        dispatch(chatActions.setMode(Mode.Text));
        dispatch(chatActions.setForwardMessages([]));
    };

    const onClickChat = (identifier: string) => {
        dispatch(navigateActions.navigateToChat({ identifier }));
        dispatch(chatActions.setMode(Mode.Forward));
    };

    return (
        <Modal opened={!!forwardMessages.length && mode === Mode.ForwardSelectChat}>
            <div className="modalHeader">
                <HeaderButton
                    keyName={'SelectChatForForwardMessagesModal/Back'}
                    onClick={closeHanlder}
                >
                    <img src={crossFilledSvg} width={20} className={'secondaryTextSvg'} alt={'crossFilledSvg'} />
                </HeaderButton>
                <div className={styles.readByCount}>
                </div>
            </div>
            <div className={['modalContent', styles.content].join(' ')} onScroll={onScrollHandler}>
                <ChatList withSelected={false} withMenu={false} onClickChat={onClickChat} />
            </div>
        </Modal>
    );
};