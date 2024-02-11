import { useFormik } from 'formik';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import backSvg from '../../../assets/svg/back.svg';
import cameraSvg from '../../../assets/svg/camera.svg';
import nextSvg from '../../../assets/svg/next.svg';
import { appActions, LeftSidebarState } from '../../../behavior/features/app/slice';
import { chatActions } from '../../../behavior/features/chats';
import { usersActions } from '../../../behavior/features/users/slice';
import { User } from '../../../behavior/features/users/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { nameof } from '../../../utils/typeUtils';
import { Input } from '../../common/formControls/Input/Input';
import { Search } from '../../common/formControls/Search/Search';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import { LeftSidebarSmallPrimaryButton } from '../../common/LeftSidebarSmallPrimaryButton/LeftSidebarSmallPrimaryButton';
import { SmallPrimaryButton } from '../../common/SmallPrimaryButton/SmallPrimaryButton';
import { Users } from '../../users/Users/Users';
import s from './ChatsCreateGroup.module.css';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';
import { formatGeesetext } from '../../../utils/stringUtils';

type FormValues = {
    name: string;
    identifier: string;
};

export const ChatsCreateGroup: FC = () => {
  const createGroupLoading = useAppSelector(s => s.chats.createChatLoading);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [state, setState] = useState<'Members' | 'ImageAndName'>('Members');
  const dispatch = useAppDispatch();
  const q = useAppSelector(s => s.users.query);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const T = useGeeseTexts();

  const schema: Yup.SchemaOf<FormValues> = Yup.object({
    name: Yup.string()
      .max(100, formatGeesetext(T.MaxMaxLengthValidation, 100))
      .required(T.Required),
  
    identifier: Yup.string()
      .max(100, formatGeesetext(T.MaxMaxLengthValidation, 100))
      .required(T.Required),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      identifier: '',
    },
    validationSchema: schema,
    onSubmit: ({ name, identifier }) => {
      console.log('submit');

      dispatch(chatActions.createGroupChatAsync({
        name,
        identifier,
        usersId: selectedUsers.map(u => u.id),
        image,
      }));
    },
  });
  
  useEffect(() => {
    formik.validateForm();
  }, [T]);

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
                <img src={backSvg} width={25} className={'secondaryTextSvg'} alt={'backSvg'} />
              </HeaderButton>
              <Search
                value={q}
                setValue={onQChange}
                placeholder={T.SearchMembers}
                // onFocus={() => setIsEnabledSearchMode(true)}
              />
            </div>
            <Users
              selectMultiple
              onSelectedUsersChange={setSelectedUsers}
              selectedUsers={selectedUsers}
            />
            <LeftSidebarSmallPrimaryButton>
              <SmallPrimaryButton onClick={() => setState('ImageAndName')}>
                <img src={nextSvg} width={25} className={'primaryTextSvg'} alt={'nextSvg'} />
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
                <img src={backSvg} width={25} className={'secondaryTextSvg'} alt={'backSvg'} />
              </HeaderButton>
              <div className={'headerTitle'}>{T.NewGroup}</div>
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
                  src={image ? URL.createObjectURL(image) : cameraSvg}
                  width={image ? 100 : 60}
                  height={image ? 100 : 60}
                  className={image ? s.image : 'primaryTextSvg'}
                  alt={'cameraSvg'} 
                />
              </div>
              <Input
                placeholder={T.GroupName}
                name={nameof<FormValues>('name')}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.name}
                errors={formik.errors.name}
              />
              <Input
                placeholder={T.Identifier}
                name={nameof<FormValues>('identifier')}
                value={formik.values.identifier}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.identifier}
                errors={formik.errors.identifier}
              />
              <LeftSidebarSmallPrimaryButton>
                <SmallPrimaryButton
                  onClick={formik.submitForm}
                  loading={createGroupLoading}
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  <img src={nextSvg} width={25} className={'primaryTextSvg'} alt={'nextSvg'} />
                </SmallPrimaryButton>
              </LeftSidebarSmallPrimaryButton>
            </form>
          </>
        )
      }
    </div>
  );
};