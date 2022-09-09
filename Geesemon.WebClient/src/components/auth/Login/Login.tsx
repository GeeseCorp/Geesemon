import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authActions } from '../../../behavior/features/auth/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { BigStrongButton } from '../../common/BigPrimaryButton/BigPrimaryButton';
import { Input } from '../../common/formControls/Input/Input';
import s from './Login.module.scss';

export const Login = () => {
    const dispatch = useAppDispatch();
    const loginLoading = useAppSelector(s => s.auth.loginLoading);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const loginHandler = () => {
        dispatch(authActions.loginAsync({
            login,
            password,
        }));
    }

    return (
        <div className={s.wrapper}>
            <h1 className={s.title}>Login in Geesmon</h1>
            <div className={s.form}>
                <Input value={login} setValue={setLogin} placeholder='Login' />
                <Input value={password} setValue={setPassword} placeholder='Password' />
                <BigStrongButton onClick={loginHandler} loading={loginLoading}>
                    Login
                </BigStrongButton>
                <Link to='/auth/register'>Register</Link>
            </div>
        </div>
    );
};
