import { FC} from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './components/auth/Login/Login';
import { LoginViaQrCode } from './components/auth/LoginViaQrCode/LoginViaQrCode';
import { Register } from './components/auth/Register/Register';
import LanguageSelection from './components/common/LanguageSelection/LanguageSelection';

export const UnauthedApp: FC = () => {
  return (
    <div className={'unauthedRoutes'}>
      <LanguageSelection />
      <Routes>
        <Route path="/auth/login/via-qr-code" element={<LoginViaQrCode />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="*" element={<Navigate replace to="/auth/login" />} />
      </Routes>
    </div>
  );
};
