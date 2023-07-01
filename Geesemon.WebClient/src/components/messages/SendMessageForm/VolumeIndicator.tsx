import styles from './SendMessageForm.module.scss';

export const VolumeIndicator = ({ volume, right }: { volume: number; right: string }) => {
    return (
        <div className={styles.volumeIndicator} style={{ right }}>
            <div className={styles.volumeIndicatorInner} style={{ width: 60 + volume * 2, height: 60 + volume * 2 }} />
        </div>
    );
};