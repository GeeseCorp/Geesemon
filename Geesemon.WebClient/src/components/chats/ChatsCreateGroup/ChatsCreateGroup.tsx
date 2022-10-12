import React, { ChangeEvent, FC, useRef, useState } from 'react';
import { Input } from '../../common/formControls/Input/Input';
import s from './ChatsCreateGroup.module.css';
import camera from '../../../assets/svg/camera.svg';
import next from '../../../assets/svg/next.svg';
import { chatActions } from '../../../behavior/features/chats';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { SmallPrimaryButton } from '../../common/SmallPrimaryButton/SmallPrimaryButton';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import back from '../../../assets/svg/back.svg';
import { appActions, LeftSidebarState } from '../../../behavior/features/app/slice';
import { LeftSidebarSmallPrimaryButton } from '../../common/LeftSidebarSmallPrimaryButton/LeftSidebarSmallPrimaryButton';
import { Users } from '../../users/Users/Users';
import { Search } from '../../common/formControls/Search/Search';
import { usersActions } from '../../../behavior/features/users/slice';
import { nameof } from '../../../utils/typeUtils';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { User } from '../../../behavior/features/users/types';

type FormValues = {
    name: string;
    username: string;
};

const schema: Yup.SchemaOf<FormValues> = Yup.object({
    name: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),

    username: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
});

export const ChatsCreateGroup: FC = () => {
    const createGroupLoading = useAppSelector(s => s.chats.createChatLoading);
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [state, setState] = useState<'Members' | 'ImageAndName'>('Members');
    const dispatch = useAppDispatch();
    const q = useAppSelector(s => s.users.q);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const formik = useFormik<FormValues>({
        initialValues: {
            name: '',
            username: '',
        },
        validationSchema: schema,
        onSubmit: ({ name, username }) => {
            console.log('submit');

            dispatch(chatActions.createGroupChatAsync({
                name,
                username,
                usersId: users.map(u => u.id),
                image,
            }));
        },
    });

    const changeInputFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            setImage(e.target.files[0]);
    };

    const onQChange = (value: string) => {
        dispatch(usersActions.setUsers([]));
        dispatch(usersActions.setSkip(0));
        dispatch(usersActions.setHasNext(true));
        dispatch(usersActions.setQ(value));
    };

    return (
        <div className={s.wrapper}>
            {state === 'Members'
                ? (
                    <>
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
                          selectMultiple
                          onSelectedUsersChange={setUsers}
                          selectedUsers={selectedUsers}
                          setSelectedUsers={setSelectedUsers}
                        />
                        <LeftSidebarSmallPrimaryButton>
                            <SmallPrimaryButton onClick={() => setState('ImageAndName')}>
                                <img src={next} width={25} className={'primaryTextSvg'} />
                            </SmallPrimaryButton>
                        </LeftSidebarSmallPrimaryButton>
                    </>
                )
                : (
                    <>
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
                              placeholder="Name"
                              name={nameof<FormValues>('name')}
                              value={formik.values.name}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              touched={formik.touched.name}
                              errors={formik.errors.name}
                            />
                            <Input
                              placeholder="Username"
                              name={nameof<FormValues>('username')}
                              value={formik.values.username}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              touched={formik.touched.username}
                              errors={formik.errors.username}
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
                )
            }
        </div>
    );
};