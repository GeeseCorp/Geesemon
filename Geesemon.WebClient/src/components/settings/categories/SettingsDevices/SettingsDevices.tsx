import React, { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../behavior/store';
import { HeaderButton } from '../../../common/HeaderButton/HeaderButton';
import s from './SettingsDevices.module.scss';
import backSvg from '../../../../assets/svg/back.svg';
import atSignSvg from '../../../../assets/svg/atSign.svg';
import stopSvg from '../../../../assets/svg/stop.svg';
import { appActions, SettingsCategory } from '../../../../behavior/features/app/slice';
import { ProfileButton } from '../../../common/ProfileButton/ProfileButton';
import { authActions } from '../../../../behavior/features/auth/slice';
import { ContextMenu } from '../../../common/ContextMenu/ContextMenu';
import { SmallLoading } from '../../../common/SmallLoading/SmallLoading';
import { useGeeseTexts } from '../../../../hooks/useGeeseTexts';

type Props = {};
export const SettingsDevices: FC<Props> = ({ }) => {
  const dispatch = useAppDispatch();
  const terminateAllOtherSessionsLoading = useAppSelector(s => s.auth.terminateAllOtherSessionsLoading);
  const currentSession = useAppSelector(s => s.auth.currentSession);
  const sessions = useAppSelector(s => s.auth.sessions.filter(s => s.id !== currentSession?.id));
  const T = useGeeseTexts();

  useEffect(() => {
    dispatch(authActions.getSessionsAsync());
  }, []);

  return (
    <div>
      <div className={['header', s.header].join(' ')}>
        <HeaderButton
          keyName={'SettingsDevices/Back'}
          onClick={() => dispatch(appActions.setSettingsCategory(null))}
        >
          <img src={backSvg} width={25} className={'secondaryTextSvg'} alt={'backSvg'} />
        </HeaderButton>
        <div className={'headerTitle'}>{T.Devices}</div>
      </div>
      <div>
        <div className={s.block}>
          <div className={`bold ${s.primaryTitle}`}>{T.ThisDevice}</div>
          <div className={s.session}>
            <div className={s.title}>
              <div className="bold">{currentSession?.userAgent}</div>
            </div>
            <div className="subText">{currentSession?.ipAddress} - {currentSession?.location}</div>
          </div>
          <div className={s.profileButtons}>
            <ProfileButton 
              icon={terminateAllOtherSessionsLoading 
                ? <SmallLoading />
                : <img src={stopSvg} width={25} className={'dangerSvg'} alt={'stopSvg'} />}
              text={T.TerminateAllOtherSessions}
              type="danger"
              onClick={() => dispatch(authActions.terminateAllOtherSessionsAsync())}
            />
          </div>
        </div>
        <div className={'divider'} />
        <div className={s.block}>
          <div className={`bold ${s.primaryTitle}`}>{T.ActiveSessions}</div>
          {sessions.map(session => (
            <ContextMenu
              items={[{
                content: 'Terminate',
                type: 'default',
                icon: <img src={stopSvg} width={20} className={'secondaryTextSvg'} alt={'stopSvg'} />,
                onClick: () => dispatch(authActions.terminateSessionAsync({ sessionId: session.id })),
              }]}
            >
              <div className={s.session}>
                <div className={s.title}>
                  <div className="bold">{session.userAgent}</div>
                  {session.isOnline 
                    ? <div className="subText">Online</div>
                    : <div className="subText">{session.lastTimeOnline}</div>
                  }
                </div>
                <div className="subText">{session.ipAddress} - {session.location}</div>
              </div>
            </ContextMenu>
          ))}
        </div>
      </div>
    </div>
  );
};