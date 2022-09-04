import {Link} from "react-router-dom";
import {useAppDispatch} from "../../behavior/store";
import {LoginForm} from "./LoginForm";
import {LoginInputType} from "../../behavior/features/auth/mutations";
import {authActions} from "../../behavior/features/auth/slice";

export const LoginBlock = () => {
    const dispatch = useAppDispatch();
    const onFinish = (values: LoginInputType) => {
        dispatch(authActions.loginAsync(values));
    };

    return (
        <div>
            <LoginForm onFinish={onFinish}/>
            <Link to={"/auth/register"}>
                To register
            </Link>
        </div>
    );
};
