import { FC, useState } from "react"
import s from './Switch.module.scss';

type Props = {
    checked: boolean
    setChecked: (checked: boolean) => void
}

export const Switch: FC<Props> = ({ checked, setChecked }) => {
    const [id] = useState(Date.now().toString());
    return (
        <div className={s.switch}>
            <input
                checked={checked}
                onChange={e => setChecked(e.target.checked)}
                className={s.input}
                type="checkbox"
                id={id}
            />
            <label className={s.label} htmlFor={id} />
        </div>
    )
}