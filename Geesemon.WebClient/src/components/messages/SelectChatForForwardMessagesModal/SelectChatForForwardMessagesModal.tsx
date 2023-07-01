import crossFilledSvg from '../../../assets/svg/crossFilled.svg';
import { chatActions } from '../../../behavior/features/chats';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import { Modal } from '../../common/Modal/Modal';
import styles from './SelectChatForForwardMessagesModal.module.scss';
import { navigateActions } from '../../../behavior/features/navigate/slice';
import { Mode } from '../../../behavior/features/chats/slice';
import { ChatList } from '../../chats/Chats/ChatList';

export const SelectChatForForwardMessagesModal = () => {
    const forwardMessageIds = useAppSelector(s => s.chats.forwardMessageIds);
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
        dispatch(chatActions.setForwardMessageIds([]));
    };

    const onClickChat = (identifier: string) => {
        dispatch(navigateActions.navigateToChat({ identifier }));
        dispatch(chatActions.setMode(Mode.Forward));
    };

    return (
        <Modal opened={!!forwardMessageIds.length && mode === Mode.Forward_SelectChat}>
            <div className="modalHeader">
                <HeaderButton
                  keyName={'SelectChatForForwardMessagesModal/Back'}
                  onClick={closeHanlder}
                >
                    <img src={crossFilledSvg} width={20} className={'secondaryTextSvg'} alt={'crossFilledSvg'} />
                </HeaderButton>
                <div className={styles.readByCount} />
            </div>
            <div className={['modalContent', styles.content].join(' ')} onScroll={onScrollHandler}>
                <ChatList withSelected={false} withMenu={false} onClickChat={onClickChat} />
            </div>
        </Modal>
    );
};