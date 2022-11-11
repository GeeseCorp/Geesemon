import { AnimatePresence } from 'framer-motion';
import { FC, useEffect, useRef, useState } from 'react';
import backSvg from '../../../assets/svg/back.svg';
import crossFilledSvg from '../../../assets/svg/crossFilled.svg';
import logoutSvg from '../../../assets/svg/logout.svg';
import menuSvg from '../../../assets/svg/menu.svg';
import pencilFilledSvg from '../../../assets/svg/pencilFilled.svg';
import personSvg from '../../../assets/svg/person.svg';
import savedSvg from '../../../assets/svg/saved.svg';
import settingsSvg from '../../../assets/svg/settings.svg';
import { appActions, LeftSidebarState } from '../../../behavior/features/app/slice';
import { authActions } from '../../../behavior/features/auth/slice';
import { chatActions } from '../../../behavior/features/chats';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { useOnScreen } from '../../../hooks/useOnScreen';
import { Search } from '../../common/formControls/Search/Search';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import { LeftSidebarSmallPrimaryButton } from '../../common/LeftSidebarSmallPrimaryButton/LeftSidebarSmallPrimaryButton';
import { Menu, MenuItem } from '../../common/Menu/Menu';
import { SmallLoading } from '../../common/SmallLoading/SmallLoading';
import { SmallPrimaryButton } from '../../common/SmallPrimaryButton/SmallPrimaryButton';
import { Chat } from '../Chat/Chat';
import s from './Chats.module.scss';

export const Chats: FC = () => {
    const dispatch = useAppDispatch();
    const logoutLoading = useAppSelector(s => s.auth.logoutLoading);
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const chatsGetLoading = useAppSelector(s => s.chats.chatsGetLoading);
    const chatsGetHasNext = useAppSelector(s => s.chats.chatsGetHasNext);
    const chats = useAppSelector(s => s.chats.chats);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isEnabledSearchMode, setIsEnabledSearchMode] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isCreateChatMenuVisible, setIsCreateChatMenuVisible] = useState(false);
    const [take] = useState(30);
    const lastChatRef = useRef<HTMLDivElement | null>(null);
    const isLastChatOnScreen = useOnScreen(lastChatRef);

    useEffect(() => {
        if(!chatsGetLoading && chatsGetHasNext && (!chats.length || isLastChatOnScreen)){
            dispatch(chatActions.chatsGetAsync({ skip: chats.length, take }));
        }
    }, [isLastChatOnScreen]);

    const menuItems: MenuItem[] = [
        {
            icon: <img src={savedSvg} className={[s.menuItem, 'secondaryTextSvg'].join(' ')} alt={'savedSvg'} />,
            content: 'Saved',
            type: 'default',
            link: `/${authedUser?.identifier}`,
        },
        {
            icon: <img src={settingsSvg} className={[s.menuItem, 'secondaryTextSvg'].join(' ')} alt={'settingsSvg'} />,
            content: 'Settings',
            onClick: () => dispatch(appActions.setLeftSidebarState(LeftSidebarState.Settings)),
            type: 'default',
        },
        {
            icon: logoutLoading ? <SmallLoading /> : <img src={logoutSvg} className={[s.menuItem, 'secondaryTextSvg'].join(' ')} alt={'logoutSvg'} />,
            content: 'Logout',
            onClick: () => dispatch(authActions.logoutAsync()),
            type: 'default',
        },
    ];

    const createChatMenuItems: MenuItem[] = [
        {
            icon: <img src={personSvg} className={[s.menuItem, 'secondaryTextSvg'].join(' ')} alt={'personSvg'} />,
            content: 'New group',
            type: 'default',
            onClick: () => dispatch(appActions.setLeftSidebarState(LeftSidebarState.CreateGroupChat)),
        },
        {
            icon: <img src={personSvg} className={[s.menuItem, 'secondaryTextSvg'].join(' ')} alt={'personSvg'} />,
            content: 'New personal chat',
            type: 'default',
            onClick: () => dispatch(appActions.setLeftSidebarState(LeftSidebarState.CreatePersonalChat)),
        },
    ];

    return (
        <div className={s.wrapper}>
            <div className={['header', s.header].join(' ')}>
                <div className={s.wrapperExtraButton}>
                    <AnimatePresence>
                        {isEnabledSearchMode
                            ? (
                                <HeaderButton
                                  keyName={'back'}
                                  onClick={() => setIsEnabledSearchMode(false)}
                                >
                                    <img src={backSvg} width={25} className={'secondaryTextSvg'} alt={'backSvg'} />
                                </HeaderButton>
                            )
                            : (
                                <>
                                <HeaderButton keyName={'menu'} onClick={() => setIsMenuVisible(true)}>
                                    <img src={menuSvg} width={20} className={'secondaryTextSvg'} alt={'menuSvg'} />
                                </HeaderButton>
                                {isMenuVisible &&
                                    <Menu
                                      items={menuItems}
                                      top={50}
                                      setOpen={setIsMenuVisible}
                                    />
                                }
                            </>
                            )
                        }
                    </AnimatePresence>
                </div>
                <Search
                  value={searchValue}
                  setValue={setSearchValue}
                  onFocus={() => setIsEnabledSearchMode(true)}
                />
            </div>
            {isEnabledSearchMode
                ? <div>search</div>
                : (
                    <div className={s.chats}>
                        {chats.map((chat, i) => (
                            <div 
                              key={chat.id}
                              ref={el => {
                                if(i === chats.length - 1)
                                    lastChatRef.current = el;
                              }}
                            >
                                <Chat chat={chat} />
                            </div>
                        ))}
                        {chatsGetLoading && 
                            <div className={s.loading}>
                                <SmallLoading />
                            </div>
                        }
                        <LeftSidebarSmallPrimaryButton>
                            <div
                              className={s.smallPrimaryButton}
                              onClick={isCreateChatMenuVisible
                                ? () => setIsCreateChatMenuVisible(false)
                                : () => setIsCreateChatMenuVisible(true)
                        }

                            >
                                <SmallPrimaryButton>
                                    {isCreateChatMenuVisible
                                        ? <img src={crossFilledSvg} width={15} className={'primaryTextSvg'} alt={'crossFilledSvg'} />
                                        : <img src={pencilFilledSvg} width={25} className={'primaryTextSvg'} alt={'pencilFilledSvg'} />}
                                </SmallPrimaryButton>
                                {isCreateChatMenuVisible &&
                                    <Menu
                                      items={createChatMenuItems}
                                      top={-90}
                                      right={0}
                                      setOpen={setIsCreateChatMenuVisible}
                                    />
                                }
                            </div>
                        </LeftSidebarSmallPrimaryButton>
                    </div>
                )
            }
        </div>
    );
};
