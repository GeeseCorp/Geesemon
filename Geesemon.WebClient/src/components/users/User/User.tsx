import { FC } from "react";
import { User as UserType } from "../../../behavior/features/users/types";
import { Avatar } from "../../common/Avatar/Avatar";
import { AvatarWithoutImage } from "../../common/AvatarWithoutImage/AvatarWithoutImage";
import s from './User.module.scss';
import { getLastTimeActivity } from '../../../utils/dateUtils';

type Props = {
    user: UserType
    selectMultiple?: boolean
    selectedUserIds: string[]
    setSelectedUserIds: (selectedUserIds: string[]) => void
    onSelectedUserIdChange?: (selectedUserIds: string[]) => void
}

export const User: FC<Props> = ({ user, selectMultiple = false, selectedUserIds, setSelectedUserIds, onSelectedUserIdChange }) => {
    const onChangeHanlder = (userId: string) => {
        let newSelectedUserIds: string[];
        if (selectMultiple) {
            if (selectedUserIds.some(id => id === userId))
                newSelectedUserIds = selectedUserIds.filter(id => id !== userId);
            else
                newSelectedUserIds = [...selectedUserIds, userId];
        }
        else {
            newSelectedUserIds = [userId];
        }
        setSelectedUserIds(newSelectedUserIds);
        onSelectedUserIdChange && onSelectedUserIdChange(newSelectedUserIds)

    }

    return (
        <div key={user.id} className={s.user} onClick={() => onChangeHanlder(user.id)}>
            {selectMultiple &&
                <div className={s.checkbox}>
                    <input
                        id={user.id}
                        type={'checkbox'}
                        checked={!!selectedUserIds.some(id => id === user.id)}
                        onChange={() => null}
                    />
                </div>
            }
            <div className={s.userInner}>
                {user.imageUrl
                    ? <Avatar imageUrl={user.imageUrl} width={54} height={54} />
                    : <AvatarWithoutImage
                        name={`${user.firstName} ${user.lastName}`}
                        backgroundColor={user.avatarColor}
                        width={54}
                        height={54}
                    />
                }
                <div className={s.userInfo}>
                    <div className={'bold'}>{user.firstName} {user.lastName}</div>
                    <div className={'subText'}>{user.isOnline ? 'Online' : getLastTimeActivity(new Date(user.lastTimeOnline))}</div>
                </div>
            </div>
        </div>
    )
}