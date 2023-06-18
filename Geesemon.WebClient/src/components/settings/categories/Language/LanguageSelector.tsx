import { HeaderButton } from '../../../common/HeaderButton/HeaderButton';
import backSvg from '../../../../assets/svg/back.svg';
import s from './LanguageSelector.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../behavior/store';
import { appActions } from '../../../../behavior/features/app/slice';
import { settingsActions } from '../../../../behavior/features/settings/slice';
import { LanguageField } from './LanguageField';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import { useGeeseTexts } from '../../../../hooks/useGeeseTexts';

export const LanguageSelector = () => {
    const dispatch = useAppDispatch();
    const languages = useAppSelector(state => state.settings.languages);
    const [selectedLangCookie, setSelectedLangCookie] = useCookies(['lang']);
    const T = useGeeseTexts();

    useEffect(() => {
        dispatch(settingsActions.getLanguagesAsync());
    }, [dispatch]);

    const setSelectedLanguage = (name: string) =>{
        setSelectedLangCookie('lang', name, { path: '/' });
        dispatch(settingsActions.getGeeseTextsAsync());
    };          
                        
    return (
        <div className={s.wrapper}>
            <div className={['header', s.header].join(' ')}>
                <HeaderButton
                  keyName={'UpdateProfile/Back'}
                  onClick={() => dispatch(appActions.setSettingsCategory(null))}
                >
                    <img src={backSvg} width={25} className={'secondaryTextSvg'} alt={'backSvg'} />
                </HeaderButton>
                <div className={'headerTitle'}>{T.LanguageSelection}</div>
            </div>
            <div>
                {languages.map(lang =>
                (
                    <div className={s.profileButtons} key={lang.key}>
                        <LanguageField
                          id={'language'}
                          key={lang.key}
                          language={lang}
                          selected={lang.key === selectedLangCookie.lang}
                          setSelected={name => setSelectedLanguage(name)}
                        />
                    </div>
                ))}
                
            </div>
        </div>
    );
};