import { FC, useState } from 'react';
import back from '../../../assets/svg/back.svg';
import { appActions, LeftSidebarState } from '../../../behavior/features/app/slice';
import { chatActions } from '../../../behavior/features/chats/slice';
import { usersActions } from '../../../behavior/features/users/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { Search } from '../../common/formControls/Search/Search';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import { Users } from '../../users/Users/Users';
import s from './ChatsCreatePersonalChat.module.scss';
import { notificationsActions } from '../../../behavior/features/notifications/slice';

type Props = {};
export const ChatsCreatePersonalChat: FC<Props> = () => {
    const dispatch = useAppDispatch();
    const q = useAppSelector(s => s.users.q);
    const users = useAppSelector(s => s.users.users);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const onSelectedUserIdChange = (selectedUserIds: string[]) => {
        const user = users.find(u => u.id === selectedUserIds[0]);
        if(!user){
            dispatch(notificationsActions.addError('User not found ofr create personal chat'));
            return;
        }
        dispatch(chatActions.createPersonalChatAsync({
            username: user.username,
        }));
    };

    const onQChange = (value: string) => {
        dispatch(usersActions.setUsers([]));
        dispatch(usersActions.setSkip(0));
        dispatch(usersActions.setHasNext(true));
        dispatch(usersActions.setQ(value));
    };

    return (
        <div className={s.wrapper}>
            <div className={['header', s.header].join(' ')}>
                <HeaderButton
                  keyName={'back'}
                  onClick={() => dispatch(appActions.setLeftSidebarState(LeftSidebarState.Chats))}
                >
                    <img src={back} width={25} className={'secondaryTextSvg'} />
                </HeaderButton>
                <Search
                  value={q}
                  setValue={onQChange}
                  placeholder={'Search users'}
                // onFocus={() => setIsEnabledSearchMode(true)}
                />
            </div>
            <Users
              selectedUserIds={selectedUserIds}
              setSelectedUserIds={setSelectedUserIds}
              onSelectedUserIdChange={onSelectedUserIdChange}
            />
        </div>
    );
};