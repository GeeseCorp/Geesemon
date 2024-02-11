import styles from './LanguageDropdown.module.scss';
import { useCookies } from 'react-cookie';
import { useAppSelector, useAppDispatch } from '../../../behavior/store';
import LanguageSelection from './LanguageSelection';
import Dropdown from '../Dropdown/Dropdown';
import { MenuItem } from '../Menu/Menu';
import { useEffect } from 'react';
import { settingsActions } from '../../../behavior/features/settings/slice';

type Props = JSX.IntrinsicElements['div'];

const LanguageDropdown = ({ className, ...rest }: Props) => {
  const dispatch = useAppDispatch();
  const [selectedLangCookie, setSelectedLangCookie] = useCookies(['lang']);
  const languages = useAppSelector(state => state.settings.languages);
  const selectedLanguage = languages.find(l => l.code === selectedLangCookie.lang);

  useEffect(() => {
    dispatch(settingsActions.getLanguagesAsync());
  }, [dispatch]);

  const setSelectedLanguage = (code: string) => {
    setSelectedLangCookie('lang', code, { path: '/' });
    dispatch(settingsActions.getGeeseTextsAsync());
  };

  const menuItems: MenuItem[] = languages.map(l => ({
    icon: <img src={l.flagUrl} className={styles.flag} alt={l.name + 'flag'} />,
    content: l.name,
    type: 'default',
    onClick: () => setSelectedLanguage(l.code),
    selected: l.code === selectedLanguage?.code,
  }));

  return (
    <Dropdown
      menuItems={menuItems}
      menuItemsClassName={styles.menuItems}
      className={`${className} ${styles.languageDropdown}`}
      {...rest}
    >
      {selectedLanguage && <img src={selectedLanguage?.flagUrl} className={styles.flag} alt={selectedLanguage?.name + 'flag'}/>}
    </Dropdown>
  );
};

export default LanguageDropdown;
