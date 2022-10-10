import { FC, memo } from "react";

import style from "./AvatarWithoutImage.module.scss";
import { getFirstAndLastName } from "../../../utils/stringUtils";

type Props = {
    name: string
    width?: number
    height?: number
    borderRadius?: number,
    backgroundColor?: string | null
    fontSize?: number
};

export const AvatarWithoutImage: FC<Props> = memo(({
    name,
    width = 50,
    height = 50,
    borderRadius = 100,
    backgroundColor,
    fontSize = 18,
}) => {
    const firstAndLastName = getFirstAndLastName(name);
    const avatarStyle = {
        width,
        height,
        backgroundColor: backgroundColor || "#" + Math.floor(Math.random() * 16777215).toString(16),
        borderRadius,
    };

    return (
        <div className={style.avatar} style={avatarStyle}>
            <div className={style.text} style={{ fontSize }}>
                {firstAndLastName[0].charAt(0).toUpperCase() + firstAndLastName[1].charAt(0).toUpperCase()}
            </div>
        </div>
    );
});
