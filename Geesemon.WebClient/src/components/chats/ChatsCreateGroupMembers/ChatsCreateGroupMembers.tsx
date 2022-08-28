import React, {FC, useEffect} from 'react';
import {Modal} from '../../common/Modal/Modal';
import {useModal} from "../../../hooks/useModal";
import s from './ChatsCreateGroupMembers.module.css';
import {Button} from "../../common/formControls/Button/Button";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAppDispatch} from "../../../behavior/store";
import {chatActions} from "../../../behavior/features/chats";

type Props = {};
export const ChatsCreateGroupMembers: FC<Props> = ({}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const {opened, show} = useModal();
    const dispatch = useAppDispatch();

    useEffect(() => {
        show();
    }, [])

    const createGroupHandler = async () => {
        const imageObjectUrl = searchParams.get('groupImage');
        let image: File | null = null;
        if (imageObjectUrl)
            image = await fetch(imageObjectUrl).then(r => r.blob()) as File;
        dispatch(chatActions.createGroupChatAsync({
            name: searchParams.get('groupName') || '',
            usersId: [],
            image: image,
        }))
    }

    return (
        <Modal opened={opened}>
            <h1>Members</h1>
            <div className={s.buttons}>
                <div className={s.innerButtons}>
                    <Button onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button onClick={createGroupHandler}>
                        Create
                    </Button>
                </div>
            </div>
        </Modal>
    );
};