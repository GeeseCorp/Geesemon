import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { authActions } from '../../../behavior/features/auth/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { BigStrongButton } from '../../common/BigPrimaryButton/BigPrimaryButton';
import { Input } from '../../common/formControls/Input/Input';
import s from './Register.module.scss';

export const Register = () => {
    const dispatch = useAppDispatch();
    const registerLoading = useAppSelector(s => s.auth.registerLoading);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const registerHandler = (e: FormEvent) => {
        e.preventDefault();
        dispatch(authActions.registerAsync({
            firstName,
            lastName,
            email,
            login,
            password,
        }));
    }

    return (
        <div className={s.wrapper}>
            <h1 className={s.title}>Register in Geesmon</h1>
            <form className={s.form} onSubmit={registerHandler}>
                <Input value={firstName} setValue={setFirstName} placeholder='First name' />
                <Input value={lastName} setValue={setLastName} placeholder='Last name' />
                <Input value={email} setValue={setEmail} placeholder='Email' />
                <Input value={login} setValue={setLogin} placeholder='Login' />
                <Input value={password} setValue={setPassword} placeholder='Password' />
                <BigStrongButton loading={registerLoading} type='submit'>
                    Register
                </BigStrongButton>
                <Link to='/auth/login'>Login</Link>
            </form>
        </div>
    );
};
