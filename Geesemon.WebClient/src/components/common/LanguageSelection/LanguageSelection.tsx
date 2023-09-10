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

  const setSelectedLanguage = (name: string) =>{
    setSelectedLangCookie('lang', name, { path: '/' });
    dispatch(settingsActions.getGeeseTextsAsync());
  };   

  return (
    <>
      {languages.map(lang =>
        (
          <div key={lang.key}>
            <LanguageField
              id={'language'}
              key={lang.key}
              language={lang}
              selected={lang.key === selectedLangCookie.lang}
              setSelected={name => setSelectedLanguage(name)}
            />
          </div>
        ))}
    </>
  );
};

export default LanguageSelection;