import styles from './Dropdown.module.scss';
import { MouseEventHandler, ReactNode, useState } from 'react';
import { Menu, MenuItem } from '../Menu/Menu';

type Props = {
  children: ReactNode;
  menuItems: MenuItem[];
  menuItemsClassName?: string;
} & JSX.IntrinsicElements['div'];

const Dropdown = ({
  children,
  menuItems,
  menuItemsClassName,
  onClick,
  className,
  ...rest
}: Props) => {
  const [oppened, setOppened] = useState(false);

  const handleClick: MouseEventHandler<HTMLDivElement> = e => {
    setOppened(true);
    onClick?.(e);
  };

  return (
    <div onClick={handleClick} className={`${styles.dropdown} ${className}`} {...rest}>
      {children}
      {oppened && (
        <Menu
          items={menuItems}
          top={50}
          setOpen={setOppened}
          className={menuItemsClassName}
        />
      )}
    </div>
  );
};

export default Dropdown;
