import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Chat } from '../../../behavior/features/chats';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import s from './ChatsUpdateGroup.module.scss';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { appActions, RightSidebarState } from '../../../behavior/features/app/slice';
import backSvg from '../../../assets/svg/back.svg';
import cameraSvg from '../../../assets/svg/camera.svg';
import { Input } from '../../common/formControls/Input/Input';
import { nameof } from '../../../utils/typeUtils';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { chatActions } from '../../../behavior/features/chats';
import { BigPrimaryButton } from '../../common/BigPrimaryButton/BigPrimaryButton';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';
import { formatGeesetext } from '../../../utils/stringUtils';

type Props = {
    chat: Chat;
};

type FormValues = {
    name: string;
    identifier: string;
};

export const ChatsUpdateGroup: FC<Props> = ({ chat }) => {
  const dispatch = useAppDispatch();
  const updateChatLoading = useAppSelector(s => s.chats.updateChatLoading);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [image] = useState<string | null | undefined>(chat.imageUrl);
  const [newImage, setNewImage] = useState<File | null>(null);
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
      name: chat.name,
      identifier: chat.identifier,
    },
    validationSchema: schema,
    onSubmit: ({ name, identifier }) => {
      dispatch(chatActions.updateChatAsync({
        id: chat.id,
        name,
        identifier,
        image: newImage,
      }));
    },
  });

  useEffect(() => {
    formik.validateForm();
  }, [T]);

  const changeInputFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setNewImage(e.target.files[0]);
  };

  return (
    <>
      <div className={['header', s.header].join(' ')}>
        <HeaderButton
          keyName={'RightSidebar/ChatsUpdateGroup/Back'}
          onClick={() => dispatch(appActions.setRightSidebarState(RightSidebarState.Profile))}
        >
          <img src={backSvg} width={20} className={'secondaryTextSvg'} alt={'backSvg'} />
        </HeaderButton>
        <div className={'headerTitle'}>Update</div>
      </div>
      <form onSubmit={formik.handleSubmit} className={s.form}>
        <div className={s.wrapperInputPhoto} onClick={() => inputFileRef.current?.click()}>
          <input
            type="file"
            className={s.inputFile}
            ref={inputFileRef}
            onChange={changeInputFileHandler}
            accept="image/png, image/gif, image/jpeg"
          />
          {newImage
            ? (
              <img
                src={newImage ? URL.createObjectURL(newImage) : cameraSvg}
                width={newImage ? 100 : 60}
                height={newImage ? 100 : 60}
                className={newImage ? s.image : 'primaryTextSvg'}
                alt={'cameraSvg'} 
              />
            )
            : (
              <img
                src={image ? image : cameraSvg}
                width={image ? 100 : 60}
                height={image ? 100 : 60}
                className={image ? s.image : 'primaryTextSvg'}
                alt={'cameraSvg'} 
              />
            )
          }
        </div>
        <Input
          placeholder={T.GroupName}
          name={nameof<FormValues>('name')}
          value={formik.values.name ?? ''}
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

        <BigPrimaryButton
          onClick={formik.submitForm}
          loading={updateChatLoading}
          disabled={!(formik.isValid && (formik.dirty || newImage))}
        >
                    Submit
        </BigPrimaryButton>
      </form>
    </>
  );
};