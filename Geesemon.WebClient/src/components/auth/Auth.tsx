import {useAppDispatch} from "../../behavior/store";
import {LoginForm} from "./LoginForm";
import {RegisterForm} from "./RegisterForm";
import style from "./auth.module.scss";
import {useRef} from "react";
import {authActions} from "../../behavior/features/auth/slice";
import {LoginInputType, RegisterInputType} from "../../behavior/features/auth/mutations";

export const Auth = () => {
    const dispatch = useAppDispatch();
    const container = useRef<HTMLDivElement>(null);

    const onLoginFinish = (values: LoginInputType) => {
        dispatch(authActions.loginAsync(values));
    };

    const onRegisterFinish = (values: RegisterInputType) => {
        dispatch(authActions.registerAsync(values));
    };

    const signIn = () => {
        if (container.current) {
            container.current.classList.remove(style.right_panel_active);
        }
    };

    const signUp = () => {
        if (container.current) {
            container.current.classList.add(style.right_panel_active);
        }
    };
    return (
        <div className={style.main}>
            <div className={style.container} id="container" ref={container}>
                <div className={`${style.form_container} ${style.sign_up_container}`}>
                    <RegisterForm onFinish={onRegisterFinish}/>
                </div>
                <div className={`${style.form_container} ${style.sign_in_container}`}>
                    <LoginForm onFinish={onLoginFinish}/>
                </div>
                <div className={style.overlay_container}>
                    <div className={style.overlay}>
                        <div className={`${style.overlay_panel} ${style.overlay_left}`}>
                            <h1>Welcome Back!</h1>
                            <p>
                                To keep connected with us please login with your personal info
                            </p>
                            <button onClick={signIn} className={style.ghost}>
                                Sign In
                            </button>
                        </div>
                        <div className={`${style.overlay_panel} ${style.overlay_right}`}>
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button onClick={signUp} className={style.ghost} id="signUp">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
