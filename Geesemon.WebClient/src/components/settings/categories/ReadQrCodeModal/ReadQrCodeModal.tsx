import { useEffect } from 'react';
import backSvg from '../../../../assets/svg/back.svg';
import { QrReader } from 'react-qr-reader';
import { useAppDispatch, useAppSelector } from '../../../../behavior/store';
import { appActions } from '../../../../behavior/features/app/slice';
import { Modal } from '../../../common/Modal/Modal';
import { HeaderButton } from '../../../common/HeaderButton/HeaderButton';
import styles from './ReadQrCodeModal.module.scss';
import { authActions } from '../../../../behavior/features/auth/slice';

export const ReadQrCodeModal = () => {
  const readQrCode = useAppSelector(s => s.app.readQrCode);
  const loginViaTokenLoading = useAppSelector(s => s.auth.loginViaTokenLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      closeModalHanlder();
    };
  }, []);

  const closeModalHanlder = () => {
    dispatch(appActions.setReadQrCode(false));
  };

  const onQrCodeResult = (text?: string, error?: string) => {
    if(!error && text && !loginViaTokenLoading){
      dispatch(authActions.loginViaTokenAsync(text));
    }
  };

  return (
    <Modal opened={!!readQrCode}>
      <div className={'modalHeader'}>
        <HeaderButton
          keyName={'ViewMessageReadByModal/Back'}
          onClick={closeModalHanlder}
        >
          <img src={backSvg} width={25} className={'secondaryTextSvg'} alt={'backSvg'} />
        </HeaderButton>
        <div className={'headerTitle'}>Scan QR code</div>
      </div>
      <div className={['modalContent', styles.content].join(' ')}>
        <QrReader
          onResult={(result, error) => onQrCodeResult(result?.getText(), error?.message)}
          constraints={{ facingMode: 'user' }}
        />
      </div>
    </Modal>
  );
};