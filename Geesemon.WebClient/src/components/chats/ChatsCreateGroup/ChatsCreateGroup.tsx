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
import { nameof } from '../../../utils/typeUtils';
import * as Yup from 'yup';
import { useFormik } from 'formik';

type FormValues = {
    groupName: string
}

const schema: Yup.SchemaOf<FormValues> = Yup.object({
    groupName: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
})

export const ChatsCreateGroup: FC = () => {
    const createGroupLoading = useAppSelector(s => s.chats.createChatLoading);
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [userIds, setUserIds] = useState<string[]>([])
    const [image, setImage] = useState<File | null>(null)
    const [state, setState] = useState<'Members' | 'ImageAndName'>('Members')
    const dispatch = useAppDispatch();
    const q = useAppSelector(s => s.users.q)
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
    const formik = useFormik<FormValues>({
        initialValues: {
            groupName: '',
        },
        validationSchema: schema,
        onSubmit: ({ groupName }) => {
            console.log('submit');
            
            dispatch(chatActions.createGroupChatAsync({
                name: groupName,
                usersId: userIds,
                image: image,
            }))
        },
    });

    const changeInputFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            setImage(e.target.files[0])
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
                    <form className={s.wrapperFormItems} onSubmit={formik.handleSubmit}>
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
                        <Input
                            placeholder='Group name'
                            name={nameof<FormValues>('groupName')}
                            value={formik.values.groupName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched.groupName}
                            errors={formik.errors.groupName}
                        />
                        <LeftSidebarSmallPrimaryButton>
                            <SmallPrimaryButton
                                onClick={formik.submitForm}
                                loading={createGroupLoading}
                                disabled={!(formik.isValid && formik.dirty)}
                            >
                                <img src={next} width={25} className={'primaryTextSvg'} />
                            </SmallPrimaryButton>
                        </LeftSidebarSmallPrimaryButton>
                    </form>
                </>
            }
        </div>
    );
};