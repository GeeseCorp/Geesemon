import React, { FC } from 'react';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import s from './Settings.module.scss';
import backSvg from '../../../assets/svg/back.svg';
import pencilOutlinedSvg from '../../../assets/svg/pencilOutlined.svg';
import atSignSvg from '../../../assets/svg/atSign.svg';
import threeDotsSvg from '../../../assets/svg/threeDots.svg';
import computerSvg from '../../../assets/svg/computer.svg';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { appActions, LeftSidebarState, SettingsCategory } from '../../../behavior/features/app/slice';
import { ProfileButton } from '../../common/ProfileButton/ProfileButton';
import { SettingsDevices } from '../categories/SettingsDevices/SettingsDevices';
import { UpdateProfile } from '../categories/UpdateProfile/UpdateProfile';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';

export const Settings: FC = () => {
    const dispatch = useAppDispatch();
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const settingsCategory = useAppSelector(s => s.app.settingsCategory);

    switch(settingsCategory){
        case SettingsCategory.Devices:
            return <SettingsDevices />;
 
        case SettingsCategory.UpdateProfile:
            return <UpdateProfile />;

        default: 
        return (
            <div>
                <div className={['header', s.header].join(' ')}>
                    <div>
                        <HeaderButton
                          keyName={'Settings/Back'}
                          onClick={() => dispatch(appActions.setLeftSidebarState(LeftSidebarState.Chats))}
                        >
                            <img src={backSvg} width={25} className={'secondaryTextSvg'} alt={'backSvg'} />
                        </HeaderButton>
                        <div className={'headerTitle'}>Settings</div>
                        </div>
                    <div>
                        <HeaderButton
                          keyName={'Settings/UpdateProfile'}
                          onClick={() => dispatch(appActions.setSettingsCategory(SettingsCategory.UpdateProfile))}
                        >
                            <img src={pencilOutlinedSvg} width={20} className={'secondaryTextSvg'} alt={'pencilOutlinedSvg'} />
                        </HeaderButton>
                    </div>
                </div>
                <div>
                    {authedUser?.imageUrl
                        ? (
                            <div className={s.wrapperImage}>
                                <img className={s.image} src={authedUser?.imageUrl} alt={'imageUrl'} />
                                <div className={s.name}>{authedUser?.fullName}</div>
                            </div>
                        )
                        : (
                            <div className={s.imageAndName}>
                                <AvatarWithoutImage
                                  name={authedUser?.fullName || ''}
                                  backgroundColor={authedUser?.avatarColor}
                                  width={100}
                                  height={100}
                                />
                                <div className={s.avatarWithoutImageName}>{authedUser?.fullName}</div>
                            </div>
                        )
                    }
                    <div className={s.profileButtons}>
                        <ProfileButton 
                          icon={<img src={atSignSvg} width={25} className={'secondaryTextSvg'} alt={'atSignSvg'} />}
                          text={authedUser?.identifier}
                          label={'Identifier'}
                        />
                    </div>
                    <div className={'divider'} />
                    <div className={s.profileButtons}>
                        <ProfileButton 
                          icon={<img src={computerSvg} width={20} className={'secondaryTextSvg'} alt={'computerSvg'} />}
                          text={'Devices'}
                          onClick={() => dispatch(appActions.setSettingsCategory(SettingsCategory.Devices))}
                        />
                    </div>
                </div>
            </div>
        );
    }
    
};