import { fancyTimeFormat } from '../../../utils/dateUtils';
import styles from './SendMessageForm.module.scss';

export const TimeAndIndicator = ({ recordingTime }: { recordingTime: number }) => {
  return (
    <div className={styles.timeAndIndicator}>
      <div>{fancyTimeFormat(recordingTime)}</div>
      <div className={styles.glowing} />
    </div>
  );
};