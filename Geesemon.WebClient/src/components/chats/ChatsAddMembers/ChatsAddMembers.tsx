import { FC, useState } from 'react';
import backSvg from '../../../assets/svg/back.svg';
import addUserFilledSvg from '../../../assets/svg/addUserFilled.svg';
import { appActions, RightSidebarState } from '../../../behavior/features/app/slice';
import { usersActions } from '../../../behavior/features/users/slice';
import { User } from '../../../behavior/features/users/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { Search } from '../../common/formControls/Search/Search';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import { SmallPrimaryButton } from '../../common/SmallPrimaryButton/SmallPrimaryButton';
import { Users } from '../../users/Users/Users';
import s from './ChatsAddMembers.module.scss';

export const ChatsAddMembers: FC = () => {
    const dispatch = useAppDispatch();
    const q = useAppSelector(s => s.users.q);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const onQChange = (value: string) => {
        console.log(value);
        
        dispatch(usersActions.setUsers([]));
        dispatch(usersActions.setSkip(0));
        dispatch(usersActions.setHasNext(true));
        dispatch(usersActions.setQ(value));
    };

    const chatsAddMembersHanlder = () => {
        console.log(selectedUsers);
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
                <SmallPrimaryButton disabled={!selectedUsers.length} onClick={chatsAddMembersHanlder}>
                    <img src={addUserFilledSvg} width={20} className={'primaryTextSvg'} alt={'addUserFilledSvg'} />
                </SmallPrimaryButton>
            </div>
    </div>
    );
};