import React, { FC } from 'react';
import s from './ProfileButton.module.scss';

type Props = {
  icon?: React.ReactNode;
  text?: string | null | React.ReactNode;
  label?: string | null;
  type?: 'default' | 'danger';
} & JSX.IntrinsicElements['div'];

export const ProfileButton: FC<Props> = ({
  icon,
  text,
  label,
  type = 'default',
  className,
  ...rest
}) => {
  return (
    <div className={`${s.profileButton} ${className}`} {...rest}>
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
