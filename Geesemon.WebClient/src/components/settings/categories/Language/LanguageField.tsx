import { Language } from '../../../../behavior/features/settings/types';
import { ProfileButton } from '../../../common/ProfileButton/ProfileButton';
import s from './LanguageField.module.scss';

type Props = {
  language: Language;
  selected: boolean;
  setSelected: (code: string) => void;
};

export const LanguageField = ({
  language: { code, name, flagUrl },
  selected,
  setSelected,
}: Props) => {
  return (
    <ProfileButton
      icon={<img src={flagUrl} className={s.flag} />}
      label={name}
      onClick={() => setSelected(code)}
      className={`${s.languageField} ${selected ? s.selected : ''}`}
    />
  );
};
