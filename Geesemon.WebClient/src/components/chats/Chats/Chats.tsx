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
import pencil from '../../../assets/svg/pencilFilled.svg'
import {Avatar} from "../../common/Avatar/Avatar";

type Props = {}

export const Chats: FC<Props> = ({}) => {
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
                                            name={chat.name || ''}
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
            <div className={s.buttonCreateChat} /*onClick={() => setLeftSidebar('create-group-chat-members')}*/>
                <StrongButton>
                    <img src={pencil} width={20}/>
                </StrongButton>
            </div>
        </div>
    );
}
