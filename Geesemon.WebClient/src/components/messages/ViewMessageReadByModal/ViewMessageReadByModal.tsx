import { FC } from "react";
import backSvg from "../../../assets/svg/back.svg";
import { chatActions } from "../../../behavior/features/chats";
import { useAppDispatch, useAppSelector } from "../../../behavior/store";
import { HeaderButton } from "../../common/HeaderButton/HeaderButton";
import { Modal } from "../../common/Modal/Modal";
import { User } from "../../users/User/User";
import { Checks } from "../Checks/Checks";
import s from './ViewMessageReadByModal.module.scss';

export const ViewMessageReadByModal: FC = () => {
    const inViewMessageIdReadBy = useAppSelector(s => s.chats.inViewMessageIdReadBy);
    const chats = useAppSelector(s => s.chats.chats);
    const dispatch = useAppDispatch();

    const inViewMessageReadBy = chats.find(c => c.messages.some(m => m.id === inViewMessageIdReadBy))?.messages?.find(m => m.id == inViewMessageIdReadBy);

    return (
        <Modal opened={!!inViewMessageIdReadBy}>
            <div className='modalHeader'>
                <HeaderButton keyName={'ViewMessageReadByModal/Back'} onClick={() => dispatch(chatActions.setInViewMessageIdReadBy(null))}>
                    <img src={backSvg} width={25} className={'secondaryTextSvg'} />
                </HeaderButton>
                <div className={s.readByCount}>
                    <Checks double={true} />
                    {/* // TODO: replace to ReadByCount variable from server */}
                    <span>{inViewMessageReadBy?.readBy.length}</span>
                </div>
            </div>
            <div style={{ width: '300px' }} className={['modalContent'].join(' ')}>
                {inViewMessageReadBy?.readBy.map(user => (
                    <User key={user.id} user={user} selectedUserIds={[]} setSelectedUserIds={selectedUserIds => { }} />
                ))}
            </div>
        </Modal>
    )
}