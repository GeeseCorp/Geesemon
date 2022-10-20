import { FC } from 'react';
import { User as UserType } from '../../../behavior/features/users/types';
import { Avatar } from '../../common/Avatar/Avatar';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import s from './User.module.scss';
import { getLastTimeActivity } from '../../../utils/dateUtils';

type Props = {
    user: UserType;
    selectMultiple?: boolean;
    selectedUsers: UserType[];
    onSelectedUsersChange?: (selectedUsers: UserType[]) => void;
};

export const User: FC<Props> = ({ user, selectMultiple = false, selectedUsers, onSelectedUsersChange }) => {
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

    return (
        <div key={user.id} className={s.user} onClick={() => onChangeHanlder(user)}>
            {selectMultiple &&
                <div className={s.checkbox}>
                    <input
                      id={user.id}
                      type={'checkbox'}
                      checked={!!selectedUsers.some(u => u.id === user.id)}
                      onChange={() => null}
                    />
                </div>
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
                    <div className={'subText'}>{user.isOnline ? 'Online' : `last seen ${getLastTimeActivity(new Date(user.lastTimeOnline))}`}</div>
                </div>
            </div>
        </div>
    );
};