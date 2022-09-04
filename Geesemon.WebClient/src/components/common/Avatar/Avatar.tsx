import {FC} from "react";

import style from "./Avatar.module.scss";

type Props = {
    width?: number
    height?: number
    borderRadius?: number,
    imageUrl: string,
};

export const Avatar: FC<Props> = ({
                                      width = 50,
                                      height = 50,
                                      borderRadius = 100,
                                      imageUrl,
                                  }) => {
    const avatarStyle = {
        width,
        height,
        borderRadius,
    };

    return (
        <div className={style.avatar} style={avatarStyle}>
            <img src={imageUrl} width={width} height={height} style={{borderRadius}}/>
        </div>
    );
}
