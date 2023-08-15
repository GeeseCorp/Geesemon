import { RadioButton } from '../../../common/formControls/RadioButton/RadioButton';
import s from './LanguageField.module.scss';

type Props = {
    id: string;
    language: {
        key: string;
        value: string;
    };
    selected: boolean;
    setSelected: (name: string) => void;
};

export const LanguageField = ({ language: { key, value }, selected, setSelected }: Props) => {
  return (
    <div className={s.languageField} onClick={_ => setSelected(key)}> 
      <RadioButton name={key} key={key} checked={selected} setChecked={setSelected} />
      {value}
    </div>
  );
};