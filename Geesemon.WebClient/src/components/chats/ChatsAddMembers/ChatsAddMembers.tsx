import { FC, useState } from 'react';
import addUserFilledSvg from '../../../assets/svg/addUserFilled.svg';
import backSvg from '../../../assets/svg/back.svg';
import { appActions, RightSidebarState } from '../../../behavior/features/app/slice';
import { chatActions } from '../../../behavior/features/chats/slice';
import { notificationsActions } from '../../../behavior/features/notifications/slice';
import { usersActions } from '../../../behavior/features/users/slice';
import { User } from '../../../behavior/features/users/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useSelectedChat } from '../../../hooks/useSelectedChat';
import { Search } from '../../common/formControls/Search/Search';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import { SmallLoading } from '../../common/SmallLoading/SmallLoading';
import { SmallPrimaryButton } from '../../common/SmallPrimaryButton/SmallPrimaryButton';
import { Users } from '../../users/Users/Users';
import s from './ChatsAddMembers.module.scss';

export const ChatsAddMembers: FC = () => {
    const dispatch = useAppDispatch();
    const q = useAppSelector(s => s.users.q);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const selectedChat = useSelectedChat();
    const chatAddMembersLoading = useAppSelector(s => s.chats.chatAddMembersLoading);

    const onQChange = (value: string) => {
        dispatch(usersActions.setUsers([]));
        dispatch(usersActions.setSkip(0));
        dispatch(usersActions.setHasNext(true));
        dispatch(usersActions.setQ(value));
    };

    const chatsAddMembersHanlder = () => {
        if(!selectedChat){
            dispatch(notificationsActions.addError('No selected chat'));            
            return;
        }
        dispatch(chatActions.chatAddMembersAsync({
            chatId: selectedChat?.id,
            userIds: selectedUsers.map(u => u.id),
        }));
        dispatch(appActions.setRightSidebarState(RightSidebarState.Profile));
    };

    return (
        <div className={s.wrapper}>
            <div className={['header', s.header].join(' ')}>
                <HeaderButton
                  keyName={'back'}
                  onClick={() => dispatch(appActions.setRightSidebarState(RightSidebarState.Profile))}
                >
                    <img src={backSvg} width={25} className={'secondaryTextSvg'} alt={'backSvg'} />
                </HeaderButton>
                <Search
                  value={q}
                  setValue={onQChange}
                  placeholder={'Search members'}
                // onFocus={() => setIsEnabledSearchMode(true)}
                />
            </div>
            <Users
              selectMultiple
              selectedUsers={selectedUsers}
              onSelectedUsersChange={setSelectedUsers}
            />
            <div className={s.buttonAddMembers}>
                <SmallPrimaryButton disabled={!selectedUsers.length || chatAddMembersLoading} onClick={chatsAddMembersHanlder}>
                      {chatAddMembersLoading 
                        ? <SmallLoading />
                        : <img src={addUserFilledSvg} width={20} className={'primaryTextSvg'} alt={'addUserFilledSvg'} />
                    }
                </SmallPrimaryButton>
            </div>
    </div>
    );
};