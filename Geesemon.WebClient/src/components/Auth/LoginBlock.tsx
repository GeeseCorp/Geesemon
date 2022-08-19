import { Link, Route, Routes } from "react-router-dom";
import { useAppDispatch } from "../../behavior/store";
import { login } from "../../behavior/features/auth/thunk";
import { LoginRequest } from "../../behavior/features/auth/types";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export const LoginBlock = () => {
  const dispatch = useAppDispatch();
  const onFinish = (values: LoginRequest) => {
    dispatch(login(values));
  };

  return (
    <div>
      <LoginForm onFinish={onFinish} />
      <Link to={"/auth/register"}>
        To register
      </Link>
    </div>
  );
};
