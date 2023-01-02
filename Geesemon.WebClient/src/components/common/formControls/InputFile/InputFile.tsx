import { FC, useRef } from 'react';
import s from './InputFile.module.scss';

type Props = {
    onChange: (files: File[] | null | undefined) => void;
    children?: React.ReactNode;
    multiple?: boolean;
};

export const InputFile: FC<Props> = ({ onChange, children, multiple }) => {
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className={s.wrapperInputPhoto} onClick={() => inputFileRef.current?.click()}>
            <input
              multiple={multiple}
              type="file"
              className={s.inputFile}
              ref={inputFileRef}
              onChange={e => e.target.files
                ? onChange(Array.from(e.target.files))
                : []
            }
            />
            {children}
        </div>
    );
};