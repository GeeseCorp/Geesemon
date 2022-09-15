import { FC, useState } from 'react';
import back from "../../../assets/svg/back.svg";
import { appActions, LeftSidebarState } from '../../../behavior/features/app/slice';
import { useAppDispatch } from "../../../behavior/store";
import { Search } from '../../common/formControls/Search/Search';
import { HeaderButton } from "../../common/HeaderButton/HeaderButton";
import { Users } from '../../users/Users/Users';
import s from './ChatsCreatePersonalChat.module.scss';
import { chatActions } from '../../../behavior/features/chats/slice';
import { message } from 'antd';

type Props = {};
export const ChatsCreatePersonalChat: FC<Props> = () => {
    const dispatch = useAppDispatch();
    const [searchValue, setSearchValue] = useState('');

    const onSelectedUserIdChange = (selectedUserIds: string[]) => {
        console.log(selectedUserIds);
        
        if (!selectedUserIds.length) {
            message.error('Select a user for create personal chat');
            return;
        }
        dispatch(chatActions.createPersonalChatAsync({
            userId: selectedUserIds[0]
        }));
    }

    return (
        <div className={s.wrapper}>
            <div className={['header', s.header].join(' ')}>
                <HeaderButton
                    key={'back'}
                    onClick={() => dispatch(appActions.setLeftSidebarState(LeftSidebarState.Chats))}
                >
                    <img src={back} width={25} />
                </HeaderButton>
                <Search
                    value={searchValue}
                    setValue={setSearchValue}
                    placeholder={'Search users'}
                // onFocus={() => setIsEnabledSearchMode(true)}
                />
            </div>
            <Users onSelectedUserIdChange={onSelectedUserIdChange} />
        </div>
    );
};