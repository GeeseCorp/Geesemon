import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { authActions } from '../../../behavior/features/auth/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { nameof } from '../../../utils/typeUtils';
import { BigStrongButton } from '../../common/BigPrimaryButton/BigPrimaryButton';
import { Input } from '../../common/formControls/Input/Input';
import s from './Login.module.scss';

type FormValues = {
    login: string
    password: string
}

const schema: Yup.SchemaOf<FormValues> = Yup.object({
    login: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
        
    password: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
})

export const Login = () => {
    const dispatch = useAppDispatch();
    const loginLoading = useAppSelector(s => s.auth.loginLoading);
    const formik = useFormik<FormValues>({
        initialValues: {
            login: '',
            password: '',
        },
        validationSchema: schema,
        onSubmit: ({ login, password }) => {
            dispatch(authActions.loginAsync({
                login,
                password,
            }));
        },
    });

    return (
        <div className={s.wrapper}>
            <h1 className={s.title}>Login in Geesmon</h1>
            <form onSubmit={formik.handleSubmit}>
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
                    loading={loginLoading}
                    type='submit'
                >
                    Login
                </BigStrongButton>
                <Link to='/auth/register'>Register</Link>
            </form>
        </div>
    );
};
