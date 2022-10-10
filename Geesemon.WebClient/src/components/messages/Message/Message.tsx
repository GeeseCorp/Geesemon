import { FC, MutableRefObject, useEffect, useRef } from "react";
import deleteSvg from "../../../assets/svg/delete.svg";
import pencilOutlinedSvg from "../../../assets/svg/pencilOutlined.svg";
import { chatActions } from "../../../behavior/features/chats";
import { Message as MessageType, MessageKind } from "../../../behavior/features/chats/types";
import { useAppDispatch, useAppSelector } from "../../../behavior/store";
import { getTimeWithoutSeconds } from "../../../utils/dateUtils";
import { ContextMenu } from "../../common/ContextMenu/ContextMenu";
import { Checks } from "../Checks/Checks";
import s from './Message.module.scss';
import { useOnScreen } from '../../../hooks/useOnScreen';

type Props = {
    message: MessageType
    inputTextRef: MutableRefObject<HTMLTextAreaElement | null>
}

export const Message: FC<Props> = ({ message, inputTextRef }) => {
    const messageIdsMakeReadLoading = useAppSelector(s => s.chats.messageIdsMakeReadLoading);
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLDivElement | null>(null)
    const isVisible = useOnScreen(ref);

    const isMessageMy = message.fromId === authedUser?.id;
    const isReadByMe = message.readBy.find(u => u.id === authedUser?.id);

    useEffect(() => {
        if (!messageIdsMakeReadLoading.find(mId => mId === message.id) && isVisible && !isReadByMe && !isMessageMy) {
            dispatch(chatActions.addMessageIdMakeReadLoading(message.id));
            dispatch(chatActions.messageMakeReadAsync({ messageId: message.id }));
        }
    }, [isVisible])


    const messageContent = () => {
        switch (message.type) {
            case MessageKind.System:
                return (
                    <div
                        ref={el => {
                            if (!isReadByMe)
                                ref.current = el;
                        }}
                        className={[s.message, s.messageSystem].join(' ')}
                    >
                        <span className={s.messageText}>{message.text}</span>
                    </div>
                )
            default:
                return (
                    <div
                        ref={el => {
                            if (!isReadByMe)
                                ref.current = el;
                        }}
                        className={[s.message, isMessageMy ? s.messageMy : null].join(' ')}
                    >
                        <span className={s.messageText}>{message.text}</span>
                        <span className={s.messageInfo}>
                            {message.createdAt !== message.updatedAt &&
                                <span className={'small light'}>Edited</span>
                            }
                            <span className={'small light'}>
                                {getTimeWithoutSeconds(new Date(message.createdAt))}
                            </span>
                            {isMessageMy && <Checks double={!!message.readBy?.length} />}
                        </span>
                    </div>
                );
        }
    }

    const setInUpdateMessage = (messageId: string) => {
        dispatch(chatActions.setInUpdateMessageId(messageId))
        dispatch(chatActions.setMode('Updating'))
        inputTextRef.current?.focus();
    }

    return (
        <ContextMenu
            items={[
                {
                    content: 'Update',
                    icon: <img src={pencilOutlinedSvg} width={15} className={'primaryTextSvg'} />,
                    onClick: () => setInUpdateMessage(message.id),
                    type: 'default',
                },
                {
                    // TODO: replace to ReadByCount variable from server and add popup for view ReadBy
                    content: `${message.readBy.length} seen`,
                    icon: <Checks double={true} />,
                    onClick: () => dispatch(chatActions.setInViewMessageIdReadBy(message.id)),
                    type: 'default',
                },
                {
                    content: 'Delete',
                    icon: <img src={deleteSvg} width={20} className={'dangerSvg'} />,
                    onClick: () => dispatch(chatActions.messageDeleteAsync({ messageId: message.id })),
                    type: 'danger',
                },
            ]}
        >
            {messageContent()}
        </ContextMenu>
    )
}