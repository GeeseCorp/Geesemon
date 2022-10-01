import React, { ChangeEvent, FC, useRef, useState } from "react"
import { Chat } from "../../../behavior/features/chats"
import { HeaderButton } from "../../common/HeaderButton/HeaderButton";
import s from './ChatsUpdateGroup.module.scss';
import { useAppDispatch } from '../../../behavior/store';
import { appActions, RightSidebarState } from "../../../behavior/features/app/slice";
import backSvg from "../../../assets/svg/back.svg";
import cameraSvg from "../../../assets/svg/camera.svg";
import { Input } from "../../common/formControls/Input/Input";

type Props = {
    chat: Chat
}

export const ChatsUpdateGroup: FC<Props> = ({ chat }) => {
    const dispatch = useAppDispatch();
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [image, setImage] = useState<string | null | undefined>(chat.imageUrl)
    const [newImage, setNewImage] = useState<File | null>(null)
    const [groupName, setGroupName] = useState(chat.name || '')
    // const [description, setDescription] = useState(chat.de)

    const changeInputFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            setNewImage(e.target.files[0])
    }

    const updateChatGroupHandler = () => {

    }

    return (
        <>
            <div className={['header', s.header].join(' ')}>
                <HeaderButton
                    keyName={'RightSidebar/ChatsUpdateGroup/Back'}
                    onClick={() => dispatch(appActions.setRightSidebarState(RightSidebarState.Profile))}
                >
                    <img src={backSvg} width={20} className={'secondaryTextSvg'} />
                </HeaderButton>
                <div className={'headerTitle'}>Update</div>
            </div>
            <form onSubmit={updateChatGroupHandler} className={s.form}>
                <div className={s.wrapperInputPhoto} onClick={() => inputFileRef.current?.click()}>
                    <input
                        type="file"
                        className={s.inputFile}
                        ref={inputFileRef}
                        onChange={changeInputFileHandler}
                        accept="image/png, image/gif, image/jpeg"
                    />
                    {newImage
                        ? <img
                            src={newImage ? URL.createObjectURL(newImage) : cameraSvg}
                            width={newImage ? 100 : 60}
                            height={newImage ? 100 : 60}
                            className={newImage ? s.image : 'secondaryTextSvg'}
                        />
                        : <img
                            src={image ? image : cameraSvg}
                            width={image ? 100 : 60}
                            height={image ? 100 : 60}
                            className={image ? s.image : 'secondaryTextSvg'}
                        />
                    }

                </div>
                <Input
                    placeholder={'Group name'}
                    value={groupName}
                    setValue={setGroupName}
                />

                {/* <Input
                    placeholder={'Description'}
                    value={description}
                    setValue={setDescription}
                /> */}
            </form>
        </>
    )
}