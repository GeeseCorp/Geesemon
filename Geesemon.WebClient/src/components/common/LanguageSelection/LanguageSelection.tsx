import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { settingsActions } from '../../../behavior/features/settings/slice';
import { useEffect } from 'react';
import { LanguageField } from '../../settings/categories/Language/LanguageField';

const LanguageSelection = () => {
  const dispatch = useAppDispatch();
  const [selectedLangCookie, setSelectedLangCookie] = useCookies(['lang']);
  const languages = useAppSelector(state => state.settings.languages);

  useEffect(() => {
    dispatch(settingsActions.getLanguagesAsync());
  }, [dispatch]);

  const setSelectedLanguage = (code: string) => {
    setSelectedLangCookie('lang', code, { path: '/' });
    dispatch(settingsActions.getGeeseTextsAsync());
  };

  return (
    <>
      {languages.map(lang => (
        <div key={lang.code}>
          <LanguageField
            language={lang}
            selected={lang.code === selectedLangCookie.lang}
            setSelected={code => setSelectedLanguage(code)}
          />
        </div>
      ))}
    </>
  );
};

export default LanguageSelection;
