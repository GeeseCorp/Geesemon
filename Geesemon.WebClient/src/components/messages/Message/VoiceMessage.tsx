import styles from './Message.module.scss';
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import playSvg from '../../../assets/svg/play.svg';
import pauseSvg from '../../../assets/svg/pause.svg';
import { fancyTimeFormat } from '../../../utils/dateUtils';
import { Message } from '../../../behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { chatActions } from '../../../behavior/features/chats';

export const VoiceMessage = ({ message }: { message: Message }) => {
  const audioWaveRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [time, setTime] = useState('');
  const repproducingMediaMessageId = useAppSelector(s => s.chats.repproducingMediaMessageId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setPlaying(false);

    wavesurfer.current = WaveSurfer.create({
      container: audioWaveRef.current!,
      waveColor: '#aaa',
      progressColor: 'white',
      cursorColor: 'white',
      cursorWidth: 2,
      barWidth: 2,
      barMinHeight: 2,
      barRadius: 2,
      responsive: true,
      height: 35,
      normalize: true,
      partialRender: true,
    });

    wavesurfer.current.load(message.fileUrl || '');

    wavesurfer.current.on('ready', () => {
      if (wavesurfer.current) {
        setTime(getTime());
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
    });

    wavesurfer.current.on('play', () => {
      if (wavesurfer.current) {
        dispatch(chatActions.setRepproducingMediaMessageId(message.id));
      }
    });

    wavesurfer.current.on('audioprocess', () => {
      if (wavesurfer.current?.isPlaying()) {
        setTime(getTime());
      }
    });

    wavesurfer.current.on('finish', () => {
      setPlaying(false);
    });

    return () => wavesurfer.current!.destroy();
  }, [message.fileUrl]);

  useEffect(() => {
    if (message.id !== repproducingMediaMessageId && playing) {
      handlePlayPause();
    }
  }, [repproducingMediaMessageId]);

  const getTime = () => {
    if (!wavesurfer.current)
      return '';

    return fancyTimeFormat(wavesurfer.current.getCurrentTime()) + ' / ' + fancyTimeFormat(wavesurfer.current.getDuration());
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
    wavesurfer.current!.playPause();
  };

  const onVolumeChange = (e: any) => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current!.setVolume(newVolume || 1);
    }
  };

  return (
    <div className={styles.voiceMessage}>
      <div onClick={handlePlayPause} className={styles.playPauseButton}>
        <img src={playing ? pauseSvg : playSvg} width={playing ? 18 : 25} className={'primarySvg'} />
      </div>
      <div className={styles.waveAndTime}>
        <div ref={audioWaveRef} />
        <div className={'small primary bold'}>{time}</div>
      </div>
      {/* <div className="controls">
        <input
          type="range"
          id="volume"
          name="volume"
          // waveSurfer recognize value of `0` same as `1`
          //  so we need to set some zero-ish value for silence
          min="0.01"
          max="1"
          step=".025"
          onChange={onVolumeChange}
          defaultValue={volume}
        />
      </div> */}
    </div>
  );
};
