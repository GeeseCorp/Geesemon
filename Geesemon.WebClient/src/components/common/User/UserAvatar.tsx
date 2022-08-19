import { memo } from "react";
import { UserBase } from "../../../behavior/userList/types";

import style from "./UserAvatar.module.scss";

type props = {
  user: UserBase;
  width?: number;
  height?: number;
  borderRadius?: number;
};

function UserAvatar({
  user,
  width = 50,
  height = 50,
  borderRadius = 100,
}: props) {
  const avatarStyle = {
    width,
    height,
    backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
    borderRadius,
  };

  return (
    <div className={style.avatar} style={avatarStyle}>
      <div className={style.text}>
        {user.firstName.charAt(0).toUpperCase() +
          user.lastName.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}

export default memo(UserAvatar);
