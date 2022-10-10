import { FC, useCallback, useEffect, useRef, useState } from "react";
import { usersActions } from '../../../behavior/features/users/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { User } from "../User/User";
import s from './Users.module.scss';
import { SmallLoading } from '../../common/SmallLoading/SmallLoading';

type Props = {
    onSelectedUserIdChange?: (selectedUserIds: string[]) => void
    selectMultiple?: boolean
    selectedUserIds: string[]
    setSelectedUserIds: (selectedUserIds: string[]) => void
}

export const Users: FC<Props> = ({ onSelectedUserIdChange, selectMultiple = false, selectedUserIds, setSelectedUserIds }) => {
    const users = useAppSelector(s => s.users.users);
    const usersGetLoading = useAppSelector(s => s.users.usersGetLoading);
    const take = useAppSelector(s => s.users.take);
    const skip = useAppSelector(s => s.users.skip);
    const hasNext = useAppSelector(s => s.users.hasNext);
    const q = useAppSelector(s => s.users.q);
    const dispatch = useAppDispatch();
    const observer = useRef<IntersectionObserver | null>(null);
    const [isFirstTimeRendered, setIsFirstTimeRendered] = useState(false)

    const lastUserElementRef = useCallback((node: HTMLDivElement) => {
        if (usersGetLoading)
            return;
        if (observer.current)
            observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNext) {
                console.log(skip + take);
                dispatch(usersActions.setSkip(skip + take));
            }
        })
        if (node)
            observer.current.observe(node);
    }, [usersGetLoading])

    useEffect(() => {
        dispatch(usersActions.usersGetAsync({
            take,
            skip,
            q,
        }))
        return () => {
            dispatch(usersActions.resetUsers());
        }
    }, [skip, take, q])

    useEffect(() => {
        if (isFirstTimeRendered) {
            setIsFirstTimeRendered(true);
            return;
        }

    }, [q])

    return (
        <div className={s.users}>
            {users.map((user, index) =>
                users.length == index + 1
                    ? <div key={user.id} ref={lastUserElementRef}>
                        <User
                            user={user}
                            selectMultiple={selectMultiple}
                            selectedUserIds={selectedUserIds}
                            setSelectedUserIds={setSelectedUserIds}
                            onSelectedUserIdChange={onSelectedUserIdChange}
                        />
                    </div>
                    : <div key={user.id} >
                        <User
                            user={user}
                            selectMultiple={selectMultiple}
                            selectedUserIds={selectedUserIds}
                            setSelectedUserIds={setSelectedUserIds}
                            onSelectedUserIdChange={onSelectedUserIdChange}
                        />
                    </div>
            )}
            {usersGetLoading &&
                <div className={s.loading}>
                    <SmallLoading />
                </div>
            }
        </div>
    )
}