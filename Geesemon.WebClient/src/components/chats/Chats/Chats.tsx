import {useAppSelector} from "../../../behavior/store";
import {Link, useLocation, useParams} from "react-router-dom";
import s from './Chat.module.css';
import {Col, Row} from "antd";
import {AvatarWithoutImage} from "../../common/AvatarWithoutImage/AvatarWithoutImage";
import {getTimeWithoutSeconds} from "../../../utils/dateUtils";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {chatActions} from "../../../behavior/features/chats";
import {ContextMenu} from "../../common/ContextMenu/ContextMenu";
import {DeleteOutlined} from "@ant-design/icons";
import {StrongButton} from "../../common/StrongButton/StrongButton";
import pencil from '../../../assets/svg/pencil.svg'
import {Avatar} from "../../common/Avatar/Avatar";

export const Chats = () => {
    const params = useParams()
    const chatId = params.chatId;
    const chats = useAppSelector(s => s.chats.chats);
    const dispatch = useDispatch();
    const [scrolledHeight, setScrolledHeight] = useState(0);
    const location = useLocation();

    useEffect(() => {
        dispatch(chatActions.getAsync());
    }, [])

    const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrolledHeight(e.currentTarget.scrollTop + e.currentTarget.offsetHeight);
    }

    return (
        <div className={s.chats} onScroll={onScroll}>
            {chats.map(chat => {
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
                                <Row justify={'space-between'} align={'top'}>
                                    <Row align={'top'} gutter={10}>
                                        <Col>
                                            {chat.imageUrl
                                                ? <Avatar imageUrl={chat.imageUrl}/>
                                                : <AvatarWithoutImage
                                                    firstName={firstName}
                                                    lastName={lastName}
                                                    backgroundColor={chat.imageUrl}
                                                />
                                            }
                                        </Col>
                                        <Col>
                                            <div className={'bold'}>{chat.name}</div>
                                            <div className={'secondary light'}>{lastMessage?.text}</div>
                                        </Col>
                                    </Row>
                                    <div
                                        className={'small light'}>{lastMessage && getTimeWithoutSeconds(new Date(lastMessage.createdAt))}</div>
                                </Row>
                            </Link>
                        </div>
                    </ContextMenu>
                )
            })}
            {/*<div className={s.buttonCreateChat} style={{top: `${scrolledHeight - 60}px`}}>*/}
            <div className={s.buttonCreateChat} style={{bottom: `5px`}}>
                <Link to={'/create-group-chat'} state={{modal: location}}>
                    <StrongButton>
                        <img src={pencil} width={20}/>
                    </StrongButton>
                </Link>
            </div>
        </div>
    );
}
