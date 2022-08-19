import { Navigate, Route, Routes } from "react-router-dom";
import { PageNotFound } from "../PageNotFound/PageNotFound";
import { Test } from "../Test/Test";
import { Auth } from "./Auth";
import { LoginBlock } from "./LoginBlock";
import { RegisterForm } from "./RegisterForm";

export function AuthLayout() {
  return (
    <Routes>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/*" element={<Auth />} />
    </Routes>
  );
}
