import { FC } from 'react';
import backSvg from '../../../assets/svg/back.svg';
import { chatActions } from '../../../behavior/features/chats';
import { usersActions } from '../../../behavior/features/users/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import { Modal } from '../../common/Modal/Modal';
import { User } from '../../users/User/User';
import { Checks } from '../Checks/Checks';
import s from './ViewMessageReadByModal.module.scss';

export const ViewMessageReadByModal: FC = () => {
    const inViewMessageIdReadBy = useAppSelector(s => s.chats.inViewMessageIdReadBy);
    const readByGetLoading = useAppSelector(s => s.users.readByGetLoading);
    const readByHasNext = useAppSelector(s => s.users.readByHasNext);
    const readByTake = useAppSelector(s => s.users.readByTake);
    const chats = useAppSelector(s => s.chats.chats);
    const dispatch = useAppDispatch();

    const chat = chats.find(c => c.messages.some(m => m.id === inViewMessageIdReadBy));
    const inViewMessageReadBy = chat?.messages?.find(m => m.id == inViewMessageIdReadBy);

    const onScrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        if (element.scrollHeight - element.clientHeight - element.scrollTop < 70 && !readByGetLoading && readByHasNext && inViewMessageIdReadBy && inViewMessageReadBy) {
            console.log('req');
            
            dispatch(usersActions.readByGetAsync({
                messageId: inViewMessageIdReadBy,
                take: readByTake,
                skip: inViewMessageReadBy?.readBy.length,
            }));
        }
    };

    return (
        <Modal opened={!!inViewMessageIdReadBy}>
            <div className="modalHeader">
                <HeaderButton
                  keyName={'ViewMessageReadByModal/Back'}
                  onClick={() => dispatch(chatActions.setInViewMessageIdReadBy(null))}
                >
                    <img src={backSvg} width={25} className={'secondaryTextSvg'} />
                </HeaderButton>
                <div className={s.readByCount}>
                    <Checks double />
                    <span>{inViewMessageReadBy?.readByCount}</span>
                </div>
            </div>
            <div className={['modalContent', s.content].join(' ')} onScroll={onScrollHandler}>
                {inViewMessageReadBy?.readBy.map((user, i) => (
                    <div
                      key={user.id}
                    >
                        <User user={user} selectedUserIds={[]} setSelectedUserIds={selectedUserIds => { }} />
                    </div>
                ))}
            </div>
        </Modal>
    );
};