import React, { ChangeEvent, FC, useRef, useState } from 'react';
import { Input } from "../../common/formControls/Input/Input";
import s from './ChatsCreateGroup.module.css';
import camera from '../../../assets/svg/camera.svg';
import next from '../../../assets/svg/next.svg';
import { chatActions } from "../../../behavior/features/chats";
import { useAppDispatch, useAppSelector } from "../../../behavior/store";
import { SmallPrimaryButton } from "../../common/SmallPrimaryButton/SmallPrimaryButton";
import { HeaderButton } from "../../common/HeaderButton/HeaderButton";
import back from "../../../assets/svg/back.svg";
import { appActions, LeftSidebarState } from '../../../behavior/features/app/slice';
import { LeftSidebarSmallPrimaryButton } from '../../common/LeftSidebarSmallPrimaryButton/LeftSidebarSmallPrimaryButton';
import { Users } from '../../users/Users/Users';
import { Search } from '../../common/formControls/Search/Search';
import { usersActions } from '../../../behavior/features/users/slice';

type Props = {};
export const ChatsCreateGroup: FC<Props> = () => {
    const createGroupLoading = useAppSelector(s => s.chats.createChatLoading);
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [groupName, setGroupName] = useState('')
    const [userIds, setUserIds] = useState<string[]>([])
    const [image, setImage] = useState<File | null>(null)
    const [state, setState] = useState<'Members' | 'ImageAndName'>('Members')
    const dispatch = useAppDispatch();
    const q = useAppSelector(s => s.users.q)
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

    const changeInputFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            setImage(e.target.files[0])
    }

    const createGroupHandler = async () => {
        dispatch(chatActions.createGroupChatAsync({
            name: groupName,
            usersId: userIds,
            image: image,
        }))
    }

    const onQChange = (value: string) => {
        dispatch(usersActions.setUsers([]));
        dispatch(usersActions.setSkip(0));
        dispatch(usersActions.setHasNext(true));
        dispatch(usersActions.setQ(value));
    }

    return (
        <div className={s.wrapper}>
            {state === 'Members'
                ? <>
                    <div className={['header', s.header].join(' ')}>
                        <HeaderButton
                            keyName={'back'}
                            onClick={() => dispatch(appActions.setLeftSidebarState(LeftSidebarState.Chats))}
                        >
                            <img src={back} width={25} className={'secondaryTextSvg'} />
                        </HeaderButton>
                        <Search
                            value={q}
                            setValue={onQChange}
                            placeholder={'Search members'}
                        // onFocus={() => setIsEnabledSearchMode(true)}
                        />
                    </div>
                    <Users
                        selectMultiple={true}
                        onSelectedUserIdChange={setUserIds}
                        selectedUserIds={selectedUserIds}
                        setSelectedUserIds={setSelectedUserIds}
                    />
                    <LeftSidebarSmallPrimaryButton>
                        <SmallPrimaryButton onClick={() => setState('ImageAndName')}>
                            <img src={next} width={25} className={'primaryTextSvg'} />
                        </SmallPrimaryButton>
                    </LeftSidebarSmallPrimaryButton>
                </>
                : <>
                    <div className={['header', s.header].join(' ')}>
                        <HeaderButton
                            keyName={'back'}
                            onClick={() => setState('Members')}
                        >
                            <img src={back} width={25} className={'secondaryTextSvg'} />
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
                                width={image ? 100 : 60}
                                height={image ? 100 : 60}
                                className={image ? s.image : 'primaryTextSvg'}
                            />
                        </div>
                        <div className={s.inputGroupName}>
                            <Input
                                placeholder={'Group name'}
                                value={groupName}
                                setValue={setGroupName}
                            />
                        </div>
                    </div>
                    <LeftSidebarSmallPrimaryButton>
                        <SmallPrimaryButton onClick={createGroupHandler} loading={createGroupLoading}>
                            <img src={next} width={25} className={'primaryTextSvg'} />
                        </SmallPrimaryButton>
                    </LeftSidebarSmallPrimaryButton>
                </>
            }
        </div>
    );
};