import {FC} from "react";

import style from "./AvatarWithoutImage.module.scss";

type Props = {
    firstName: string
    lastName: string
    width?: number
    height?: number
    borderRadius?: number,
    backgroundColor?: string | null,
};

export const AvatarWithoutImage: FC<Props> = ({
                                      firstName,
                                      lastName,
                                      width = 50,
                                      height = 50,
                                      borderRadius = 100,
                                      backgroundColor,
                                  }) => {
    const avatarStyle = {
        width,
        height,
        backgroundColor: backgroundColor || "#" + Math.floor(Math.random() * 16777215).toString(16),
        borderRadius,
    };

    return (
        <div className={style.avatar} style={avatarStyle}>
            <div className={style.text}>
                {firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}
            </div>
        </div>
    );
}
