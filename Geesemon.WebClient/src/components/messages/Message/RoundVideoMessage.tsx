import styles from './Message.module.scss';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { fancyTimeFormat } from '../../../utils/dateUtils';
import { MessageAdditionalInfo } from './MessageAdditionalInfo';
import { Message } from '../../../behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { chatActions } from '../../../behavior/features/chats';

type Props = {
  message: Message;
  isMessageMy: boolean;
};

export const RoundVideoMessage = ({ message, isMessageMy }: Props) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [time, setTime] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const repproducingMediaMessageId = useAppSelector(s => s.chats.repproducingMediaMessageId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTime(getTime(videoRef.current!));
  }, []);

  useEffect(() => {
    if (message.id !== repproducingMediaMessageId && playing) {
      pause();
    }
  }, [repproducingMediaMessageId]);

  const pause = () => {
    setPlaying(false);
    videoRef.current!.pause();
  };

  const onClick = () => {
    if (playing) {
      pause();
    }
    else {
      setPlaying(true);
      videoRef.current!.play();
    }
  };

  const onPlay = () => {
    dispatch(chatActions.setRepproducingMediaMessageId(message.id));
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
      <video
        src={message.fileUrl || ''}
        ref={videoRef}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onPlay={onPlay}
      />
      <MessageAdditionalInfo
        message={message}
        isMessageMy={isMessageMy}
        className={styles.info}
        primary
      />
      <div className={`${styles.time} small primary`}>{time}</div>
      {/* {videoRef.current?.currentTime > 0 && (
        <img src={fileSvg} width={25} className={'primaryTextSvg'} alt={'fileSvg'} />
      )} */}
    </div>
  );
};
