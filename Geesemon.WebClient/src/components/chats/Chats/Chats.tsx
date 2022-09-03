import {useAppSelector} from "../../../behavior/store";
import {Link, useLocation, useParams} from "react-router-dom";
import s from './Chats.module.css';
import {AvatarWithoutImage} from "../../common/AvatarWithoutImage/AvatarWithoutImage";
import {getTimeWithoutSeconds} from "../../../utils/dateUtils";
import {FC, useEffect} from "react";
import {useDispatch} from "react-redux";
import {chatActions} from "../../../behavior/features/chats";
import {ContextMenu} from "../../common/ContextMenu/ContextMenu";
import {DeleteOutlined} from "@ant-design/icons";
import {StrongButton} from "../../common/StrongButton/StrongButton";
import pencil from '../../../assets/svg/pencil-filled.svg'
import {Avatar} from "../../common/Avatar/Avatar";
import {useLeftSidebar} from "../../../hooks/useLeftSidebar";

type Props = {}

export const Chats: FC<Props> = ({}) => {
    const [leftSidebar, setLeftSidebar] = useLeftSidebar();
    const params = useParams()
    const chatId = params.chatId;
    const chats = useAppSelector(s => s.chats.chats);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if (!chats.length)
            dispatch(chatActions.getAsync());
    }, [])

    return (
        <div className={s.chats}>
            {chats.slice(0).reverse().map(chat => {
                const parts = chat.name?.split(' ')[0] || [];
                const firstName = parts.length ? parts[0] : '';
                const lastName = parts.length > 1 ? parts[1] : '';
                const lastMessage = chat.messages?.length ? chat.messages?.reduce((a, b) => a.createdAt > b.createdAt ? a : b, chat.messages[0]) : null;
                return (
                    <ContextMenu
                        key={chat.id}
                        items={[
                            {
                                content: 'Delete chat',
                                icon: <DeleteOutlined/>,
                                // onClick: () => dispatch(),
                                type: 'danger',
                            },
                        ]}
                    >
                        <div className={[s.chat, chat.id === chatId ? s.chatSelected : null].join(' ')}>
                            <Link
                                to={`/${chat.id}`}
                                className={s.chatLink}
                            >
                                <div className={s.chatInner}>
                                    {chat.imageUrl
                                        ? <Avatar imageUrl={chat.imageUrl}/>
                                        : <AvatarWithoutImage
                                            firstName={firstName}
                                            lastName={lastName}
                                            backgroundColor={chat.imageUrl}
                                        />
                                    }
                                    <div className={s.chatInfo}>
                                        <div className={'bold'}>{chat.name}</div>
                                        <div
                                            className={['secondary light', s.chatLastMessage].join(' ')}>{lastMessage?.text}</div>
                                    </div>
                                    <div
                                        className={'small light'}>{lastMessage && getTimeWithoutSeconds(new Date(lastMessage.createdAt))}</div>
                                </div>
                            </Link>
                        </div>
                    </ContextMenu>
                )
            })}
            {/*<div className={s.buttonCreateChat} style={{top: `${scrolledHeight - 60}px`}}>*/}
            <div className={s.buttonCreateChat} onClick={() => {
                // setLeftSidebar('create-group-chat-members')
            }}>
                <StrongButton>
                    <img src={pencil} width={20}/>
                </StrongButton>
            </div>
        </div>
    );
}
