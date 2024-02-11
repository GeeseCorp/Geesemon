import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { usersActions } from '../../../behavior/features/users/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { User } from '../User/User';
import s from './Users.module.scss';
import { SmallLoading } from '../../common/SmallLoading/SmallLoading';
import { User as UserType } from '../../../behavior/features/users/types';
import { MenuItem } from '../../common/Menu/Menu';

type Props = {
    onSelectedUsersChange?: (selectedUsers: UserType[]) => void;
    selectMultiple?: boolean;
    selectedUsers: UserType[];
    getContextMenuItems?: (user: UserType) => MenuItem[];
};

export const Users: FC<Props> = ({ onSelectedUsersChange, selectMultiple = false, selectedUsers, getContextMenuItems }) => {
  const users = useAppSelector(s => s.users.users);
  const usersGetLoading = useAppSelector(s => s.users.usersGetLoading);
  const take = useAppSelector(s => s.users.take);
  const skip = useAppSelector(s => s.users.skip);
  const hasNext = useAppSelector(s => s.users.hasNext);
  const query = useAppSelector(s => s.users.query);
  const dispatch = useAppDispatch();
  const observer = useRef<IntersectionObserver | null>(null);
  const [isFirstTimeRendered, setIsFirstTimeRendered] = useState(false);

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
    });
    if (node)
      observer.current.observe(node);
  }, [usersGetLoading]);

  useEffect(() => {
    dispatch(usersActions.usersGetAsync({
      take,
      skip,
      query,
    }));
    return () => {
      dispatch(usersActions.resetUsers());
    };
  }, [skip, take, query]);

  useEffect(() => {
    if (isFirstTimeRendered) {
      setIsFirstTimeRendered(true);
      return;
    }

  }, [query]);

  return (
    <div className={s.users}>
      {users.map((user, index) =>
        users.length === index + 1
          ? (
            <div key={user.id} ref={lastUserElementRef}>
              <User
                user={user}
                selectMultiple={selectMultiple}
                selectedUsers={selectedUsers}
                onSelectedUsersChange={onSelectedUsersChange}
                getContextMenuItems={getContextMenuItems}
              />
            </div>
          )
          : (
            <div key={user.id}>
              <User
                user={user}
                selectMultiple={selectMultiple}
                selectedUsers={selectedUsers}
                onSelectedUsersChange={onSelectedUsersChange}
                getContextMenuItems={getContextMenuItems}
              />
            </div>
          ),
      )}
      {usersGetLoading &&
                <div className={s.loading}>
                  <SmallLoading />
                </div>
      }
    </div>
  );
};