import React, { ChangeEvent, FC, useRef, useState } from "react"
import { Chat } from "../../../behavior/features/chats"
import { HeaderButton } from "../../common/HeaderButton/HeaderButton";
import s from './ChatsUpdateGroup.module.scss';
import { useAppDispatch } from '../../../behavior/store';
import { appActions, RightSidebarState } from "../../../behavior/features/app/slice";
import backSvg from "../../../assets/svg/back.svg";
import cameraSvg from "../../../assets/svg/camera.svg";
import { Input } from "../../common/formControls/Input/Input";
import { nameof } from "../../../utils/typeUtils";
import * as Yup from 'yup';
import { useFormik } from "formik";

type Props = {
    chat: Chat
}

type FormValues = {
    groupName: string
}

const schema: Yup.SchemaOf<FormValues> = Yup.object({
    groupName: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
})

export const ChatsUpdateGroup: FC<Props> = ({ chat }) => {
    const dispatch = useAppDispatch();
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [image, setImage] = useState<string | null | undefined>(chat.imageUrl)
    const [newImage, setNewImage] = useState<File | null>(null)
    const formik = useFormik<FormValues>({
        initialValues: {
            groupName: '',
        },
        validationSchema: schema,
        onSubmit: ({ groupName }) => {
        },
    });

    const changeInputFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            setNewImage(e.target.files[0])
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
            <form onSubmit={formik.handleSubmit} className={s.form}>
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
                            className={newImage ? s.image : 'primaryTextSvg'}
                        />
                        : <img
                            src={image ? image : cameraSvg}
                            width={image ? 100 : 60}
                            height={image ? 100 : 60}
                            className={image ? s.image : 'primaryTextSvg'}
                        />
                    }

                </div>
                <Input
                    placeholder='Group name'
                    name={nameof<FormValues>('groupName')}
                    value={formik.values.groupName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.groupName}
                    errors={formik.errors.groupName}
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