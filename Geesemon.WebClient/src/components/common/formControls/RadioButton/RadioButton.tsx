import s from './RadioButton.module.scss';

type Props = {
    name: string;
    checked: boolean;
    setChecked: (name: string) => void;
};

export const RadioButton = ({ name, checked, setChecked } : Props) => {
  return (
    <div>
      <input 
        type="radio"
        name={name}
        className={s.select}
        checked={checked} 
        onChange={e => setChecked(e.target.name)}
      />
    </div>
  );
};