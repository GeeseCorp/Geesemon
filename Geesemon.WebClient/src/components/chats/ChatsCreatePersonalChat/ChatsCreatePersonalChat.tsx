import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backSvg from '../../../assets/svg/back.svg';
import { appActions, LeftSidebarState } from '../../../behavior/features/app/slice';
import { notificationsActions } from '../../../behavior/features/notifications/slice';
import { usersActions } from '../../../behavior/features/users/slice';
import { User } from '../../../behavior/features/users/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { Search } from '../../common/formControls/Search/Search';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import { Users } from '../../users/Users/Users';
import s from './ChatsCreatePersonalChat.module.scss';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';

type Props = {};
export const ChatsCreatePersonalChat: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const q = useAppSelector(s => s.users.query);
  const users = useAppSelector(s => s.users.users);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const T = useGeeseTexts();

  const onSelectedUsersChange = (selectedUsers: User[]) => {
    setSelectedUsers(selectedUsers);
    const user = users.find(u => u.id === selectedUsers[0].id);
    if(!user){
      dispatch(notificationsActions.addError('User not found ofr create personal chat'));
      return;
    }

    navigate(`/${user.identifier}`);
    dispatch(appActions.setLeftSidebarState(LeftSidebarState.Chats));
  };

  const onQChange = (value: string) => {
    dispatch(usersActions.setQ(value));
    dispatch(usersActions.setUsers([]));
    dispatch(usersActions.setSkip(0));
    dispatch(usersActions.setHasNext(true));
  };

  return (
    <div className={s.wrapper}>
      <div className={['header', s.header].join(' ')}>
        <HeaderButton
          keyName={'back'}
          onClick={() => dispatch(appActions.setLeftSidebarState(LeftSidebarState.Chats))}
        >
          <img src={backSvg} width={25} className={'secondaryTextSvg'} alt={'backSvg'} />
        </HeaderButton>
        <Search
          value={q}
          setValue={onQChange}
          placeholder={T.SearchUsers}
          // onFocus={() => setIsEnabledSearchMode(true)}
        />
      </div>
      <Users
        selectedUsers={selectedUsers}
        onSelectedUsersChange={onSelectedUsersChange}
      />
    </div>
  );
};