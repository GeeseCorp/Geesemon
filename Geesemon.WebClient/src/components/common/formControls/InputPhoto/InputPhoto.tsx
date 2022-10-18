import React, { ChangeEventHandler, FC, useRef } from 'react';
import s from './InputPhoto.module.scss';
import cameraSvg from '../../../../assets/svg/camera.svg';

type Props = {
    image?: string | null;
    onChange: ChangeEventHandler<HTMLInputElement>;
};

export const InputPhoto: FC<Props> = ({ image, onChange }) => {
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className={s.wrapperInputPhoto} onClick={() => inputFileRef.current?.click()}>
            <input
              type="file"
              className={s.inputFile}
              ref={inputFileRef}
              onChange={onChange}
              accept="image/png, image/gif, image/jpeg"
            />
            <img
              src={image ? image : cameraSvg}
              width={image ? 100 : 60}
              height={image ? 100 : 60}
              className={image ? s.image : 'primaryTextSvg'}
              alt={'cameraSvg'} 
            />
        </div>
    );
};