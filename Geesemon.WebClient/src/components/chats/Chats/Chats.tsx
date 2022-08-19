import {useAppSelector} from "../../../behavior/store";
import {Link, useParams} from "react-router-dom";
import s from './Chat.module.css';
import {Col, Row} from "antd";
import {Avatar} from "../../common/Avatar/Avatar";
import {getTimeWithoutSeconds} from "../../../utils/dateUtils";

export const Chats = () => {
    const params = useParams()
    const chatId = params.chatId;
    const chats = useAppSelector(s => s.chats.chats);
    const messages = useAppSelector(s => s.messages.messages)

    return (
        <div className={s.chats}>
            {chats.map(chat => {
                const parts = chat.name?.split(' ')[0] || [];
                const firstName = parts.length ? parts[0] : '';
                const lastName = parts.length > 1 ? parts[1] : '';
                const chatMessages = messages.filter(m => m.chatId === chat.id);
                const lastMessage = chatMessages.length ? chatMessages.reduce((a, b) => a.createdAt > b.createdAt ? a : b, chatMessages[0]) : null;
                return (
                    <div className={[s.chat, chat.id === chatId ? s.chatSelected : null].join(' ')}>
                        <Link
                            to={`/${chat.id}`}
                            className={s.chatLink}
                        >
                            <Row justify={'space-between'} align={'top'}>
                                <Row align={'top'} gutter={10}>
                                    <Col>
                                        <Avatar firstName={firstName} lastName={lastName}/>
                                    </Col>
                                    <Col>
                                        <div className={'bold'}>{chat.name}</div>
                                        <div className={'secondary light'}>{lastMessage?.text}</div>
                                    </Col>
                                </Row>
                                <div className={'small light'}>{lastMessage && getTimeWithoutSeconds(new Date(lastMessage.createdAt))}</div>
                            </Row>
                        </Link>
                    </div>
                )
            })}
        </div>
    );
}
