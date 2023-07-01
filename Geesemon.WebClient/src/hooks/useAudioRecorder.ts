import { useEffect, useRef, useState } from 'react';

export enum RecordingState {
    Recording = 'Recording',
    Recorded = 'Recorded',
    Default = 'Default',
}

export const useAudioRecorder = (video: boolean, onGetRecord: (blob: Blob) => void) => {
    const stream = useRef<MediaStream | null>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const setStream = (s: MediaStream | null) => {
        stream.current = s;
        setMediaStream(s);
    };

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const analyser = useRef<AnalyserNode | null>(null);
    const dataArray = useRef<Uint8Array>(new Uint8Array(0));
    const source = useRef<MediaStreamAudioSourceNode | null>(null);
    const [volume, setVolume] = useState(0);
    const [recordingTime, setRecordingTime] = useState(0);
    const startTime = useRef(0);

    const [recordingState, setRecordingState] = useState(RecordingState.Default);
    const state = useRef(RecordingState.Default);
    const setState = (s: RecordingState) => {
        state.current = s;
        setRecordingState(s);
    };

    useEffect(() => {
        return () => {
        };
    }, []);

    const startRecording = async () => {
        setState(RecordingState.Recording);
        setRecordingTime(0);
        startTime.current = performance.now();
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video,
        });
        setStream(stream);

        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.start();
        mediaRecorder.current.ondataavailable = e => {
            if (state.current === RecordingState.Recorded) {
                onGetRecord(e.data);
                setState(RecordingState.Default);
            }
        };

        audioContext.current = new AudioContext();
        analyser.current = audioContext.current.createAnalyser();
        source.current = audioContext.current.createMediaStreamSource(stream);
        dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
        source.current.connect(analyser.current);
        requestAnimationFrame(tick);
    };

    const tick = () => {
        if (!stream.current)
            return;

        analyser.current?.getByteTimeDomainData(dataArray.current);
        setVolume(Math.floor(((Math.max(...dataArray.current) / 255) * 100) - 40));
        requestAnimationFrame(tick);
        setRecordingTime(Math.floor((performance.now() - startTime.current) / 1000));
    };

    const stopRecording = () => {
        setState(RecordingState.Recorded);
        mediaRecorder.current?.stop();
        stream.current?.getTracks().forEach(track => track.stop());
        setStream(null);
    };

    const discardRecording = () => {
        setState(RecordingState.Default);
        mediaRecorder.current?.stop();
        stream.current?.getTracks().forEach(track => track.stop());
        setStream(null);
    };

    return {
        startRecording,
        stopRecording,
        discardRecording,
        volume,
        recordingState,
        recordingTime,
        mediaStream,
    };
};