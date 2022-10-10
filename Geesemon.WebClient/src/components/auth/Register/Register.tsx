import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { authActions } from '../../../behavior/features/auth/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { BigStrongButton } from '../../common/BigPrimaryButton/BigPrimaryButton';
import { Input } from '../../common/formControls/Input/Input';
import s from './Register.module.scss';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { nameof } from '../../../utils/typeUtils';

type FormValues = {
    firstName: string
    lastName?: string
    email?: string
    login: string
    password: string
}

const schema: Yup.SchemaOf<FormValues> = Yup.object({
    firstName: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),

    lastName: Yup.string()
        .max(100, 'Must be 100 characters or less'),

    email: Yup.string()
        .email('Bad email')
        .max(100, 'Must be 100 characters or less'),

    login: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),

    password: Yup.string()
        .min(3, 'Must be 3 characters or more')
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
})

export const Register = () => {
    const dispatch = useAppDispatch();
    const registerLoading = useAppSelector(s => s.auth.registerLoading);
    const formik = useFormik<FormValues>({
        initialValues: {
            firstName: '',
            lastName: undefined,
            email: undefined,
            login: '',
            password: '',
        },
        validationSchema: schema,
        onSubmit: ({ firstName, lastName, email, login, password }) => {
            dispatch(authActions.registerAsync({
                firstName,
                lastName: lastName || undefined,
                email: email || undefined,
                login,
                password,
            }));
        },
    });

    return (
        <div className={s.wrapper}>
            <h1 className={s.title}>Register in Geesmon</h1>
            <form onSubmit={formik.handleSubmit}>
                <Input
                    placeholder='FirstName'
                    name={nameof<FormValues>('firstName')}
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.firstName}
                    errors={formik.errors.firstName}
                />
                <Input
                    placeholder='LastName'
                    name={nameof<FormValues>('lastName')}
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.lastName}
                    errors={formik.errors.lastName}
                />
                <Input
                    placeholder='Email'
                    name={nameof<FormValues>('email')}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.email}
                    errors={formik.errors.email}
                />
                <Input
                    placeholder='Login'
                    name={nameof<FormValues>('login')}
                    value={formik.values.login}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.login}
                    errors={formik.errors.login}
                />
                <Input
                    placeholder='Password'
                    name={nameof<FormValues>('password')}
                    type={'password'}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.password}
                    errors={formik.errors.password}
                />
                <BigStrongButton
                    disabled={!(formik.isValid && formik.dirty)}
                    loading={registerLoading}
                    type='submit'
                >
                    Register
                </BigStrongButton>
                <Link to='/auth/login'>Login</Link>
            </form>
        </div>
    );
};
