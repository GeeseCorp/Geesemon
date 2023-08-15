import React, { FC, MouseEventHandler } from 'react';
import s from './ProfileButton.module.scss';

type Props = {
    icon: React.ReactNode;
    text?: string | null | React.ReactNode;
    label?: string | null;
    type?: 'default' | 'danger';
    onClick?: MouseEventHandler | undefined;
};

export const ProfileButton: FC<Props> = ({ icon, text, label, onClick, type = 'default' }) => {
  return (
    <div className={s.profileButton} onClick={onClick}>
      <div className={s.icon}>
        {icon}
      </div>
      <div className={s.content}>
        {text && <div className={`${s.text} ${type === 'danger' && 'danger'}`}>{text}</div>}
        {label && <div className={`${s.label} ${type === 'danger' && 'danger'}`}>{label}</div>}
      </div>
    </div>
  );
};