import { useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../../behavior/store";
import { AuthLayout } from "../Auth/AuthLayout";
import { AppLayout } from "../Layout/Layout";
import { Test } from "../Test/Test";

export function ApplicationRoutes() {
  let isAuthorized = useSelector((state: RootState) => state.user.isAuthorized);
  console.log(isAuthorized);

  if (!isAuthorized)
    return (
      <Routes>
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="*" element={<Navigate replace to="/auth" />} />
      </Routes>
    );
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<>Placeholer</>} />
        <Route path="chat/:userLogin" element={<Test />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </AppLayout>
  );
}
