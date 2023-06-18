import styles from './Login.module.scss';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { authActions } from '../../../behavior/features/auth/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { nameof } from '../../../utils/typeUtils';
import { BigPrimaryButton } from '../../common/BigPrimaryButton/BigPrimaryButton';
import { Input } from '../../common/formControls/Input/Input';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';

type FormValues = {
    identifier: string;
    password: string;
};

const schema: Yup.SchemaOf<FormValues> = Yup.object({
    identifier: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
        
    password: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
});

export const Login = () => {
    const dispatch = useAppDispatch();
    const loginLoading = useAppSelector(s => s.auth.loginLoading);
    const T = useGeeseTexts();
    const formik = useFormik<FormValues>({
        initialValues: {
            identifier: '',
            password: '',
        },
        validationSchema: schema,
        onSubmit: ({ identifier, password }) => {
            dispatch(authActions.loginAsync({
                identifier,
                password,
            }));
        },
    });

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{T.LoginInGeesemon}</h1>
            <form onSubmit={formik.handleSubmit}>
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
                  loading={loginLoading}
                  type="submit"
                >
                    {T.Login}
                </BigPrimaryButton>
                <div className={styles.links}>
                    <Link to="/auth/register">{T.Register}</Link>
                    <Link to="/auth/login/via-qr-code">{T.LoginViaQRCode}</Link>
                </div>
            </form>
        </div>
    );
};
