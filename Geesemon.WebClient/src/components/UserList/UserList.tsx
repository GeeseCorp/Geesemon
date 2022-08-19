import { Avatar, List } from "antd";
import { useEffect } from "react";
import { Triangle } from "react-loader-spinner";
import { useAppDispatch, useAppSelector } from "../../behavior/store";
import { getAllUsers } from "../../behavior/userList/thunk";
import UserLine from "./UserLine";

import style from "./UserList.module.scss";

function UserList() {
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.userList.userList);
  const usersLoading = useAppSelector((state) => state.userList.isLoading);

  useEffect(() => {
    dispatch(getAllUsers());
    console.log("adasdasd");
  }, [dispatch]);

  if (usersLoading) return <Triangle height={50} width={50} />;

  return (
    <List
      dataSource={users ?? []}
      className={style.list}
      renderItem={(item) => (
        <List.Item className={style.item}>
          <UserLine user={item} />
        </List.Item>
      )}
    />
  );
}

export default UserList;
