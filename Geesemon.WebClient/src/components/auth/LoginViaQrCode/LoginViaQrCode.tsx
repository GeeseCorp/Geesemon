import styles from './LoginViaQrCode.module.scss';
import { Link } from 'react-router-dom';
import { authActions } from '../../../behavior/features/auth/slice';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useEffect } from 'react';
import { SmallLoading } from '../../common/SmallLoading/SmallLoading';
import { useSubscription } from '@apollo/client';
import { LoginViaQrCodeData, LoginViaQrCodeVars, LOGIN_VIA_QR_CODE_SUBSCRIPTIONS } from '../../../behavior/features/auth/subscriptions';
import { useDispatch } from 'react-redux';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';

export const LoginViaQrCode = () => {
  const dispatch = useAppDispatch();
  const generateLoginQrCodeLoading = useAppSelector(s => s.auth.generateLoginQrCodeLoading);
  const loginQrCode = useAppSelector(s => s.auth.loginQrCode);
  const T = useGeeseTexts();

  useEffect(() => {
    dispatch(authActions.generateLoginQrCodeAsync());
  }, []);
    
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{T.LoginInGeesemonViaQRCode}</h1>
      <div className={styles.content}>
        <div className={styles.loginQrCode}>
          {!generateLoginQrCodeLoading && loginQrCode
            ? (
              <>
                <img src={loginQrCode.qrCodeUrl} className={styles.qrCode} />
                <Subscribe token={loginQrCode.token} />
              </>
            )
            : <SmallLoading />
          }
        </div>
        <Link to="/auth/login">{T.LoginViaCredentials}</Link>
      </div>
    </div>
  );
};

const Subscribe = ({ token }: { token: string }) => {
  const dispatch = useDispatch();
  const loginViaQrCodeSubscription = useSubscription<LoginViaQrCodeData, LoginViaQrCodeVars>(LOGIN_VIA_QR_CODE_SUBSCRIPTIONS, {
    variables: { token },
  });

  useEffect(() => {
    const data = loginViaQrCodeSubscription.data;
    if(data) {
      dispatch(authActions.login(data.loginViaToken.authResponse));
    }
  }, [loginViaQrCodeSubscription.data, dispatch]);

  return null;
};
