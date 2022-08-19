import Avatar from "antd/lib/avatar/avatar";
import { UserBase } from "../../behavior/userList/types";
import UserAvatar from "../common/User/UserAvatar";

import style from "./UserList.module.scss";

type props = {
  user: UserBase;
};

function UserLine({ user }: props) {
  return (
    <div className={style.user}>
      <UserAvatar user={user} />
      <div className={style.userName}>
        {user.firstName + " " + user.lastName}
      </div>
    </div>
  );
}

export default UserLine;
