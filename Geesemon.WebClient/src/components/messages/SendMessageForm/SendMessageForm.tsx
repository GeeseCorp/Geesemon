import React, {FC, useRef} from 'react';
import s from './SendMessageForm.module.css';
import {SendOutlined, SmileOutlined} from "@ant-design/icons";
import {Avatar} from "antd";
import smile from "../../../assets/svg/smile.svg";
import send from "../../../assets/svg/send.svg";
import clip from "../../../assets/svg/clip.svg";

type Props = {};
export const SendMessageForm: FC<Props> = () => {
    const inputTextRef = useRef<HTMLTextAreaElement | null>(null)

    const onInputText = () => {
        if (inputTextRef.current) {
            if (!inputTextRef.current?.value) {
                console.log(inputTextRef.current?.value)
                inputTextRef.current.style.height = '25px';
                return;
            }
            if (inputTextRef.current.scrollHeight > 400 || inputTextRef.current.scrollHeight < 25)
                return;

            inputTextRef.current.style.height = (inputTextRef.current.scrollHeight) + "px";
        }
    }

    return (
        <div className={s.wrapper}>
            <div className={s.wrapperInputText}>
                <img src={smile} className={s.inputTextButton}/>
                <textarea placeholder={'Message'} ref={inputTextRef} onInput={onInputText}
                          className={s.inputText}></textarea>
                <img src={clip} className={s.inputTextButton}/>
            </div>
            <div className={s.buttonSend}>
                <img src={send}/>
            </div>
        </div>
    );
};