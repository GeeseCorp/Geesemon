import { FC, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from '../../../behavior/store';
import { Avatar } from "../../common/Avatar/Avatar";
import { AvatarWithoutImage } from "../../common/AvatarWithoutImage/AvatarWithoutImage";
import s from './Users.module.scss';
import { usersActions } from '../../../behavior/features/users/slice';
import { User } from "../../../behavior/features/auth/types";

type Props = {
    onSelectedUserIdChange?: (selectedUserIds: string[]) => void
    selectMultiple?: boolean
}

export const Users: FC<Props> = ({ onSelectedUserIdChange, selectMultiple = false }) => {
    const users = useAppSelector(s => s.users.users);
    const dispatch = useAppDispatch();
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

    useEffect(() => {
        if (!users.length)
            dispatch(usersActions.usersGetAsync({
                take: 10,
                skip: 0,
                q: '',
            }))
    }, [])

    const onChangeHanlder = (userId: string) => {
        let newSelectedUserIds: string[];
        if (selectedUserIds.some(id => id === userId))
            newSelectedUserIds = selectedUserIds.filter(id => id !== userId);
        else
            newSelectedUserIds = [...selectedUserIds, userId];
        setSelectedUserIds(newSelectedUserIds);
        onSelectedUserIdChange && onSelectedUserIdChange(newSelectedUserIds)
    }

    return (
        <div className={s.users}>
            {users.map(user => {
                const id = `user_${user.id}`
                return (
                    <div key={id} className={s.user} onClick={() => selectMultiple || onChangeHanlder(user.id)}>
                        {selectMultiple &&
                            <div className={s.checkbox}>
                                <input
                                    id={id}
                                    type={'checkbox'}
                                    checked={!!selectedUserIds.some(id => id === user.id)}
                                    onChange={e => onChangeHanlder(user.id)}
                                />
                            </div>
                        }
                        <label htmlFor={id} className={s.userInner}>
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
                                <div className={['secondary light'].join(' ')}>last seen</div>
                            </div>
                        </label>
                    </div>
                )
            })}
        </div>
    )
}