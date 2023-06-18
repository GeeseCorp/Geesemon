import { Link } from 'react-router-dom';
import { authActions } from '../../../behavior/features/auth/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { BigPrimaryButton } from '../../common/BigPrimaryButton/BigPrimaryButton';
import { Input } from '../../common/formControls/Input/Input';
import s from './Register.module.scss';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { nameof } from '../../../utils/typeUtils';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';

type FormValues = {
    firstName: string;
    lastName?: string;
    email?: string;
    identifier: string;
    password: string;
};

const schema: Yup.SchemaOf<FormValues> = Yup.object({
    firstName: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),

    lastName: Yup.string()
        .max(100, 'Must be 100 characters or less'),

    email: Yup.string()
        .email('Bad email')
        .max(100, 'Must be 100 characters or less'),

        identifier: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),

    password: Yup.string()
        .min(3, 'Must be 3 characters or more')
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
});

export const Register = () => {
    const dispatch = useAppDispatch();
    const registerLoading = useAppSelector(s => s.auth.registerLoading);
    const formik = useFormik<FormValues>({
        initialValues: {
            firstName: '',
            lastName: undefined,
            email: undefined,
            identifier: '',
            password: '',
        },
        validationSchema: schema,
        onSubmit: ({ firstName, lastName, email, identifier, password }) => {
            dispatch(authActions.registerAsync({
                firstName,
                lastName: lastName || undefined,
                email: email || undefined,
                identifier,
                password,
            }));
        },
    });
    const T = useGeeseTexts();

    return (
        <div className={s.wrapper}>
            <h1 className={s.title}>{T.RegisterInGeesemon}</h1>
            <form onSubmit={formik.handleSubmit}>
                <Input
                  placeholder={T.Firstname}
                  name={nameof<FormValues>('firstName')}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.firstName}
                  errors={formik.errors.firstName}
                />
                <Input
                  placeholder={T.Lastname}
                  name={nameof<FormValues>('lastName')}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.lastName}
                  errors={formik.errors.lastName}
                />
                <Input
                  placeholder={T.Email}
                  name={nameof<FormValues>('email')}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.email}
                  errors={formik.errors.email}
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
                <Input
                  placeholder={T.Password}
                  name={nameof<FormValues>('password')}
                  type={'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.password}
                  errors={formik.errors.password}
                />
                <BigPrimaryButton
                  disabled={!(formik.isValid && formik.dirty)}
                  loading={registerLoading}
                  type="submit"
                >
                    {T.Register}
                </BigPrimaryButton>
                <Link to="/auth/login">{T.Login}</Link>
            </form>
        </div>
    );
};
