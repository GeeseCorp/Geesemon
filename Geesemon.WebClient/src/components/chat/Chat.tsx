import { Button } from "antd";
import styles from "./chat.module.css";

export function Chat() {
  return (
    <div>
      <div className={styles.chat}>
        <textarea />
        <Button>SENT</Button>
      </div>
    </div>
  );
}
