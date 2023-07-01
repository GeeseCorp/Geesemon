import styles from './Message.module.scss';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { fancyTimeFormat } from '../../../utils/dateUtils';
import { MessageAdditionalInfo } from './MessageAdditionalInfo';
import { Message } from '../../../behavior/features/chats/types';

type Props = {
  message: Message;
  isMessageMy: boolean;
};

export const RoundVideoMessage = ({ message, isMessageMy }: Props) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [time, setTime] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setTime(getTime(videoRef.current!));
  }, []);

  const onClick = () => {
    if (playing) {
      setPlaying(false);
      videoRef.current!.pause();
    }
    else {
      setPlaying(true);
      videoRef.current!.play();
    }
  };

  const onEnded = () => {
    setPlaying(false);
  };

  const onTimeUpdate = (e: SyntheticEvent<HTMLVideoElement>) => {
    const target = (e.target as HTMLVideoElement);
    setTime(getTime(target));
  };

  const getTime = (target: HTMLVideoElement) => fancyTimeFormat(target.currentTime) + ' / ' + fancyTimeFormat(target.duration);

  return (
    <div className={styles.roundVideoMessage} onClick={onClick}>
      <video src={message.fileUrl || ''} ref={videoRef} onEnded={onEnded} onTimeUpdate={onTimeUpdate} />
      <MessageAdditionalInfo message={message} isMessageMy={isMessageMy} className={styles.info} primary />
      <div className={`${styles.time} small primary`}>{time}</div>
      {/* {videoRef.current?.currentTime > 0 && (
        <img src={fileSvg} width={25} className={'primaryTextSvg'} alt={'fileSvg'} />
      )} */}
    </div>
  );
};
