import { FC, useState } from 'react';
import backSvg from '../../../../assets/svg/back.svg';
import checkSvg from '../../../../assets/svg/check.svg';
import { appActions } from '../../../../behavior/features/app/slice';
import { useAppDispatch, useAppSelector } from '../../../../behavior/store';
import { Input } from '../../../common/formControls/Input/Input';
import { InputPhoto } from '../../../common/formControls/InputPhoto/InputPhoto';
import { HeaderButton } from '../../../common/HeaderButton/HeaderButton';
import s from './UpdateProfile.module.scss';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { nameof } from '../../../../utils/typeUtils';
import { SmallPrimaryButton } from '../../../common/SmallPrimaryButton/SmallPrimaryButton';
import { authActions } from '../../../../behavior/features/auth/slice';
import { SmallLoading } from '../../../common/SmallLoading/SmallLoading';

type Props = {};

type FormValues = {
    firstname: string;
    lastname?: string;
    username: string;
};

const schema: Yup.SchemaOf<FormValues> = Yup.object({
    firstname: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
    lastname: Yup.string()
        .max(100, 'Must be 100 characters or less'),
    username: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
});

export const UpdateProfile: FC<Props> = ({ }) => {
    const dispatch = useAppDispatch();
    const updateProfileLoading = useAppSelector(s => s.auth.updateProfileLoading);
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const formik = useFormik<FormValues>({
        initialValues: {
            firstname: authedUser?.firstName || '',
            lastname: authedUser?.lastName || '',
            username: authedUser?.username || '',
        },
        validationSchema: schema,
        onSubmit: ({ firstname, lastname, username }) => {
            dispatch(authActions.updateProfileAsync({
                firstname,
                lastname,
                username,
                image,
                imageUrl,
            }));
        },
    });
    const [imageUrl, setImageUrl] = useState(authedUser?.imageUrl);
    const [image, setImage] = useState<File | null>(null);

    return (
        <div className={s.wrapper}>
            <div className={['header', s.header].join(' ')}>
                <HeaderButton
                  keyName={'UpdateProfile/Back'}
                  onClick={() => dispatch(appActions.setSettingsCategory(null))}
                >
                    <img src={backSvg} width={25} className={'secondaryTextSvg'} alt={'backSvg'} />
                </HeaderButton>
                <div className={'headerTitle'}>Update Profile</div>
            </div>
            <form onSubmit={formik.handleSubmit} className={s.form}>
                <InputPhoto
                  image={image ? URL.createObjectURL(image) : imageUrl} 
                  onChange={e => e.target.files && setImage(e.target.files[0])}
                />
                <Input
                  placeholder="Firstname"
                  name={nameof<FormValues>('firstname')}
                  value={formik.values.firstname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.firstname}
                  errors={formik.errors.firstname}
                />
                <Input
                  placeholder="Lastname"
                  name={nameof<FormValues>('lastname')}
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.lastname}
                  errors={formik.errors.lastname}
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
                <div className={s.bottonSubmit}>
                    <SmallPrimaryButton type="submit">
                        {updateProfileLoading 
                            ? <SmallLoading />
                            : <img src={checkSvg} width={15} className={'primaryTextSvg'} alt={'checkSvg'} />
                        }
                    </SmallPrimaryButton>
                </div>

                {/* <Input
                    placeholder={'Description'}
                    value={description}
                    setValue={setDescription}
                /> */}
            </form>
        </div>
    );
};