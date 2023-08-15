import styles from './SendMessageForm.module.scss';
import { HeaderButton } from '../../common/HeaderButton/HeaderButton';
import { Modal } from '../../common/Modal/Modal';
import backSvg from '../../../assets/svg/back.svg';
import sendSvg from '../../../assets/svg/send.svg';
import deleteSvg from '../../../assets/svg/delete.svg';
import { RecordingType } from './SendMessageForm';
import { RecordingState } from '../../../hooks/useAudioRecorder';
import { useEffect, useRef } from 'react';
import { SmallPrimaryButton } from '../../common/SmallPrimaryButton/SmallPrimaryButton';
import { AnimatePresence, motion } from 'framer-motion';
import { VolumeIndicator } from './VolumeIndicator';
import { TimeAndIndicator } from './TimeAndIndicator';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';

type Props = {
    mediaStream: MediaStream | null;
    recordingType: RecordingType;
    recordingState: RecordingState;
    volume: number;
    recordingTime: number;
    stopRecording: () => void;
    discardRecording: () => void;
};

export const RoundVideoRecordingModal = ({
  mediaStream,
  recordingType,
  recordingState,
  volume,
  recordingTime,
  stopRecording,
  discardRecording,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const T = useGeeseTexts();

  useEffect(() => {
    if (recordingType === 'RoundVideo' && recordingState === RecordingState.Recording && videoRef.current && mediaStream)
      videoRef.current.srcObject = mediaStream;
  }, [recordingType, recordingState, mediaStream]);

  const oppened = recordingType === 'RoundVideo' && recordingState === RecordingState.Recording;

  return (
    <Modal opened={oppened} className={styles.roundedVideoRecording}>
      <div className={'modalHeader'}>
        <HeaderButton
          keyName={'RoundVideoRecordingModal/Back'}
          onClick={discardRecording}
        >
          <img src={backSvg} width={25} className={'secondaryTextSvg'} alt={'backSvg'} />
        </HeaderButton>
        <div className={'headerTitle'}>{T.RecordingVideo}</div>
      </div>
      <div className={'modalContent'}>
        <video ref={videoRef} muted autoPlay />
        <div className={styles.controls}>
          <TimeAndIndicator recordingTime={recordingTime} />
          <div className={styles.right}>
            <SmallPrimaryButton onClick={discardRecording} className={styles.buttonDiscardRecording}>
              <AnimatePresence>
                <motion.img
                  key={'discard'}
                  width={25}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={deleteSvg}
                  className={'dangerSvg'}
                />
              </AnimatePresence>
            </SmallPrimaryButton>
            <div className={styles.send}>
              <VolumeIndicator volume={volume} right="25px" />
              <SmallPrimaryButton onClick={stopRecording}>
                <AnimatePresence>
                  <motion.img
                    key={'send'}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={sendSvg}
                    className={'primaryTextSvg'}
                  />
                </AnimatePresence>
              </SmallPrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};