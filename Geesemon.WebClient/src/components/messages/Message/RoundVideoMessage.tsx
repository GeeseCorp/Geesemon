import styles from './Message.module.scss';
import { useEffect, useRef, useState } from 'react';
import playSvg from '../../../assets/svg/play.svg';
import pauseSvg from '../../../assets/svg/pause.svg';
import { fancyTimeFormat } from '../../../utils/dateUtils';
import fileSvg from '../../../assets/svg/.svg';

export const RoundVideoMessage = ({ url }: { url: string }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [time, setTime] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
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

  return (
    <div className={styles.roundVideoMessage} onClick={onClick}>
      <video src={url} ref={videoRef} onEnded={onEnded} />
      {/* {videoRef.current?.currentTime > 0 && (
        <img src={fileSvg} width={25} className={'primaryTextSvg'} alt={'fileSvg'} />
      )} */}
    </div>
  );
};
