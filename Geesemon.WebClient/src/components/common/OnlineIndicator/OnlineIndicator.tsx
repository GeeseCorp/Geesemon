import React, { FC } from 'react';
import s from './OnlineIndicator.module.scss';

type Props = {
    right?: number;
    bottom?: number;
};

export const OnlineIndicator: FC<Props> = ({ right = 0, bottom = 0 }) => {
  return (
    <div
      className={s.onlineIndicator}
      style={{ right, bottom }}
    />
  );
};