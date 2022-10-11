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
    username: string;
    password: string;
};

const schema: Yup.SchemaOf<FormValues> = Yup.object({
    username: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
        
    password: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
});

export const Login = () => {
    const dispatch = useAppDispatch();
    const loginLoading = useAppSelector(s => s.auth.loginLoading);
    const formik = useFormik<FormValues>({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: schema,
        onSubmit: ({ username, password }) => {
            dispatch(authActions.loginAsync({
                username,
                password,
            }));
        },
    });

    return (
        <div className={s.wrapper}>
            <h1 className={s.title}>Login in Geesmon</h1>
            <form onSubmit={formik.handleSubmit}>
                <Input
                  placeholder="Username"
                  name={nameof<FormValues>('username')}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.username}
                  errors={formik.errors.username}
                />
                <Input
                  placeholder="Password"
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
                  type="submit"
                >
                    Login
                </BigStrongButton>
                <Link to="/auth/register">Register</Link>
            </form>
        </div>
    );
};
