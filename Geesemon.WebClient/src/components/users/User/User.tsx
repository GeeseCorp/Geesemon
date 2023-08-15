import s from './User.module.scss';
import { FC } from 'react';
import { User as UserType } from '../../../behavior/features/users/types';
import { Avatar } from '../../common/Avatar/Avatar';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import { getLastTimeActivity } from '../../../utils/dateUtils';
import { Checkbox } from '../../common/formControls/Checkbox/Checkbox';
import { MenuItem } from '../../common/Menu/Menu';
import { ContextMenu } from '../../common/ContextMenu/ContextMenu';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';
import { format } from '../../../utils/stringUtils';

type Props = {
    user: UserType;
    selectMultiple?: boolean;
    selectedUsers: UserType[];
    onSelectedUsersChange?: (selectedUsers: UserType[]) => void;
    getContextMenuItems?: (user: UserType) => MenuItem[];
};

export const User: FC<Props> = ({ user, selectMultiple = false, selectedUsers, onSelectedUsersChange, getContextMenuItems }) => {
  const onChangeHanlder = (user: UserType) => {
    let newSelectedUsers: UserType[];
    if (selectMultiple) {
      if (selectedUsers.some(u => u.id === user.id))
        newSelectedUsers = selectedUsers.filter(u => u.id !== user.id);
      else
        newSelectedUsers = [...selectedUsers, user];
    }
    else {
      newSelectedUsers = [user];
    }
    onSelectedUsersChange && onSelectedUsersChange(newSelectedUsers);
  };
  const T = useGeeseTexts();

  const items = getContextMenuItems ? getContextMenuItems(user) : [];

  return (
    <ContextMenu items={items}>
      <div key={user.id} className={s.user} onClick={() => onChangeHanlder(user)}>
        {selectMultiple &&
                    <Checkbox  
                      checked={!!selectedUsers.some(u => u.id === user.id)}
                      setChecked={() => null}
                    />
        }
        <div className={s.userInner}>
          {user.imageUrl
            ? <Avatar imageUrl={user.imageUrl} width={54} height={54} />
            : (
              <AvatarWithoutImage
                name={user.fullName}
                backgroundColor={user.avatarColor}
                width={54}
                height={54}
              />
            )
          }
          <div className={s.userInfo}>
            <div className={'bold'}>{user.firstName} {user.lastName}</div>
            <div className={'subText'}>{user.isOnline ? T.OnlineStatus : format(T.LastSeen, getLastTimeActivity(new Date(user.lastTimeOnline)))}</div>
          </div>
        </div>
      </div>
    </ContextMenu>
  );
};