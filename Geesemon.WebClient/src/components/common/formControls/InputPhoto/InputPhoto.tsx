import { FC, useRef } from 'react';
import cameraSvg from '../../../../assets/svg/camera.svg';
import deleteSvg from '../../../../assets/svg/delete.svg';
import s from './InputPhoto.module.scss';

type Props = {
    image?: string | null;
    onChange: (files: File[] | null | undefined) => void;
};

export const InputPhoto: FC<Props> = ({ image, onChange }) => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={s.wrapper}>
      <div className={s.wrapperInputPhoto} onClick={() => inputFileRef.current?.click()}>
        <input
          type="file"
          className={s.inputFile}
          ref={inputFileRef}
          onChange={e => e.target.files
            ? onChange(Array.from(e.target.files))
            : []
          }
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
      {image && 
                <button type="button" className={`${s.remove}`} onClick={() => {
                  console.log('gg');
                    
                  onChange([]);
                }}
                >
                  <img src={deleteSvg} width={20} className={'dangerSvg center'} alt="deleteSvg" />
                </button>
      }
    </div>
  );
};