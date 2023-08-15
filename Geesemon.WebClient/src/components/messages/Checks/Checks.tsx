import React, { FC } from 'react';
import s from './Checks.module.scss';
import checkSvg from '../../../assets/svg/check.svg';

type Props = {
    double?: boolean;
};
export const Checks: FC<Props> = ({ double = false }) => {
  return (
    <div className={s.checks}>
      <img src={checkSvg} className={[s.check, s.checkLeft, 'primaryTextSvg'].join(' ')} alt={'checkSvg'} />
      {double && <img src={checkSvg} className={[s.check, s.checkRight, 'primaryTextSvg'].join(' ')} alt={'checkSvg'} />}
    </div>
  );
};