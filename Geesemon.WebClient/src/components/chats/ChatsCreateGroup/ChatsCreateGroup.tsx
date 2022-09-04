import React, {ChangeEvent, FC, useEffect, useRef, useState} from 'react';
import {Modal} from '../../common/Modal/Modal';
import {useModal} from "../../../hooks/useModal";
import {Input} from "../../common/formControls/Input/Input";
import s from './ChatsCreateGroup.module.css';
import {Button} from "../../common/formControls/Button/Button";
import camera from '../../../assets/svg/camera.svg';
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";

type Props = {};
export const ChatsCreateGroup: FC<Props> = ({}) => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const {opened, show} = useModal();
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [groupName, setGroupName] = useState(searchParams.get('groupName') || '')
    const [image, setImage] = useState<File | null>(null)

    useEffect(() => {
        show();
    }, [])

    const changeInputFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            setImage(e.target.files[0])
    }

    return (
        <Modal opened={opened}>
            <div className={s.wrapperFormItems}>
                <div className={s.wrapperInputPhoto} onClick={() => inputFileRef.current?.click()}>
                    <input
                        type="file"
                        className={s.inputFile}
                        ref={inputFileRef}
                        onChange={changeInputFileHandler}
                        accept="image/png, image/gif, image/jpeg"
                    />
                    <img
                        src={image ? URL.createObjectURL(image) : camera}
                        width={image ? 80 : 50}
                        className={image ? s.image : ''}
                    />
                </div>
                <Input
                    name={'groupName'}
                    placeholder={'Group name'}
                    value={groupName}
                    setValue={setGroupName}
                />
            </div>
            <div className={s.buttons}>
                <div className={s.innerButtons}>
                    <Button onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Link state={{modal: location}}
                          to={`members?groupName=${groupName}&groupImage=${image ? URL.createObjectURL(image) : ''}`}>
                        <Button>
                            Next
                        </Button>
                    </Link>
                </div>
            </div>
        </Modal>
    );
};