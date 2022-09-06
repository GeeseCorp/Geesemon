import React, {ChangeEvent, FC, useRef, useState} from 'react';
import {Input} from "../../common/formControls/Input/Input";
import s from './ChatsCreateGroup.module.css';
import camera from '../../../assets/svg/camera.svg';
import next from '../../../assets/svg/next.svg';
import {chatActions} from "../../../behavior/features/chats";
import {useAppDispatch, useAppSelector} from "../../../behavior/store";
import {StrongButton} from "../../common/StrongButton/StrongButton";
import {appActions, LeftSidebarState} from "../../../behavior/app/slice";
import {HeaderButton} from "../../common/HeaderButton/HeaderButton";
import back from "../../../assets/svg/back.svg";

type Props = {};
export const ChatsCreateGroup: FC<Props> = () => {
    const createGroupLoading = useAppSelector(s => s.chats.createGroupLoading);
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [groupName, setGroupName] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [state, setState] = useState<'Members' | 'ImageAndName'>('Members')
    const dispatch = useAppDispatch();

    const changeInputFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            setImage(e.target.files[0])
    }

    const createGroupHandler = async () => {
        dispatch(chatActions.createGroupChatAsync({
            name: groupName,
            usersId: [],
            image: image,
        }))
    }

    return (
        <div className={s.wrapper}>
            {state === 'Members'
                ? <>
                    <div className={['header', s.header].join(' ')}>
                        <HeaderButton
                            key={'back'}
                            onClick={() => dispatch(appActions.setLeftSidebarState(LeftSidebarState.Chats))}
                        >
                            <img src={back} width={25}/>
                        </HeaderButton>
                        <div className={'headerTitle'}>Add members</div>
                    </div>
                    <div className={s.nextButton}>
                        <StrongButton onClick={() => setState('ImageAndName')}>
                            <img src={next} width={25}/>
                        </StrongButton>
                    </div>
                </>
                : <>
                    <div className={['header', s.header].join(' ')}>
                        <HeaderButton
                            key={'back'}
                            onClick={() => setState('Members')}
                        >
                            <img src={back} width={25}/>
                        </HeaderButton>
                        <div className={'headerTitle'}>New Group</div>
                    </div>
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
                    <div className={s.nextButton}>
                        <StrongButton onClick={createGroupHandler} loading={createGroupLoading}>
                            <img src={next} width={25}/>
                        </StrongButton>
                    </div>
                </>
            }
        </div>
    );
};