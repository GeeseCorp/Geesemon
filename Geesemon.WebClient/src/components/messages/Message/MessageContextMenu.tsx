import styles from './Message.module.scss';
import { ReactNode } from 'react';
import { Mode, chatActions } from '../../../behavior/features/chats/slice';
import { Avatar } from '../../common/Avatar/Avatar';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import { ContextMenu } from '../../common/ContextMenu/ContextMenu';
import { MenuItem } from '../../common/Menu/Menu';
import deleteSvg from '../../../assets/svg/delete.svg';
import pencilOutlinedSvg from '../../../assets/svg/pencilOutlined.svg';
import replySvg from '../../../assets/svg/reply.svg';
import selectSvg from '../../../assets/svg/select.svg';
import copySvg from '../../../assets/svg/copy.svg';
import downloadSvg from '../../../assets/svg/download.svg';
import { useAppDispatch, useAppSelector } from '../../../behavior/store';
import { ChatKind, Message } from '../../../behavior/features/chats/types';
import { useSelectedChat } from '../../../hooks/useSelectedChat';
import { Checks } from '../Checks/Checks';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';
import { downloadFile } from '../../../utils/fileUtils';

type Props = {
    children: ReactNode;
    message: Message;
    inputTextFocus?: () => void;
};

export const MessageContextMenu = ({ children, message, inputTextFocus }: Props) => {
    const selectedMessageIds = useAppSelector(s => s.chats.selectedMessageIds);
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const selectedChat = useSelectedChat();
    const dispatch = useAppDispatch();
    const T = useGeeseTexts();

    const onCopy = () => {
        const messageText = message.text ?? message.forwardedMessage?.text;
        if (!messageText)
            return;

        navigator.clipboard.writeText(messageText);
    };

    const getContextMenuItems = (): MenuItem[] => {
        const items: MenuItem[] = [];

        if (selectedMessageIds.length) {
            items.push({
                content: T.ForwardSelected,
                icon: <img src={replySvg} width={17} className={['primaryTextSvg', styles.forwardSvg].join(' ')} alt={'forwardSvg'} />,
                onClick: () => setForwardMessageIdsHandler(selectedMessageIds),
                type: 'default',
            });

            items.push({
                content: T.DeleteSelected,
                icon: <img src={deleteSvg} width={20} className={'dangerSvg'} alt={'deleteSvg'} />,
                onClick: () => dispatch(chatActions.messageDeleteAsync({ messageIds: selectedMessageIds })),
                type: 'danger',
            });

            items.push({
                content: T.ClearSelection,
                icon: <img src={selectSvg} width={15} className={'primaryTextSvg'} alt={'selectSvg'} />,
                onClick: () => {
                    dispatch(chatActions.setSelectedMessageIds([]));
                    dispatch(chatActions.setMode(Mode.Text));
                },
                type: 'default',
            });
        }
        else {
            items.push({
                content: T.Reply,
                icon: <img src={replySvg} width={17} className={'primaryTextSvg'} alt={'replySvg'} />,
                onClick: () => setReplyMessageHandler(message.id),
                type: 'default',
            });

            if (message.fromId === authedUser?.id && !message.forwardedMessage)
                items.push({
                    content: T.Update,
                    icon: <img src={pencilOutlinedSvg} width={15} className={'primaryTextSvg'} alt={'pencilOutlinedSvg'} />,
                    onClick: () => setInUpdateMessageHandler(message.id),
                    type: 'default',
                });

            if (message.text || message.forwardedMessage?.text) {
                items.push({
                    content: T.Copy,
                    icon: <img src={copySvg} width={15} className={'primaryTextSvg'} alt={'copySvg'} />,
                    type: 'default',
                    onClick: onCopy,
                });
            }

            if (message.fileUrl)
                items.push({
                    content: T.Download,
                    icon: <img src={downloadSvg} width={17} className="primaryTextSvg" alt={'downloadSvg'} />,
                    onClick: () => downloadFile(message.fileUrl!),
                    type: 'default',
                });

            items.push(
                // {
                //     content: T.Pin,
                //     // icon: <img src={pencilOutlinedSvg} width={15} className={'primaryTextSvg'} alt={'pencilOutlinedSvg'} />,
                //     type: 'default',
                // },
                {
                    content: T.Forward,
                    icon: <img src={replySvg} width={17} className={['primaryTextSvg', styles.forwardSvg].join(' ')} alt={'forwardSvg'} />,
                    onClick: () => setForwardMessageIdsHandler([message.id]),
                    type: 'default',
                },
                {
                    content: T.Select,
                    icon: <img src={selectSvg} width={15} className={'primaryTextSvg'} alt={'selectSvg'} />,
                    onClick: () => dispatch(chatActions.setSelectedMessageIds([message.id])),
                    type: 'default',
                },
            );

            if (selectedChat?.type !== ChatKind.Saved)
                items.push({
                    content: <div className={styles.readBy}>
                        <div>{message.readByCount} {T.Seen}</div>
                        <div className={styles.last3ReadBy}>
                            {message.readBy.slice(0, 3).map(user => user.imageUrl
                                ? (
                                    <Avatar
                                        key={user.id}
                                        width={22}
                                        height={22}
                                        imageUrl={user.imageUrl}
                                    />
                                )
                                : (
                                    <AvatarWithoutImage
                                        key={user.id}
                                        width={22}
                                        height={22}
                                        fontSize={8}
                                        backgroundColor={user.avatarColor}
                                        name={user.fullName}
                                    />
                                ),
                            )}
                        </div>
                    </div>,
                    icon: <Checks double />,
                    onClick: () => dispatch(chatActions.setInViewMessageIdReadBy(message.id)),
                    type: 'default',
                });

            if (message.fromId === authedUser?.id || selectedChat?.type === ChatKind.Personal)
                items.push({
                    content: T.Delete,
                    icon: <img src={deleteSvg} width={20} className={'dangerSvg'} alt={'deleteSvg'} />,
                    onClick: () => dispatch(chatActions.messageDeleteAsync({ messageIds: [message.id] })),
                    type: 'danger',
                });
        }

        return items;
    };

    const setInUpdateMessageHandler = (messageId: string) => {
        dispatch(chatActions.setInUpdateMessageId(messageId));
        dispatch(chatActions.setMode(Mode.Updating));
        inputTextFocus && inputTextFocus();
    };

    const setReplyMessageHandler = (messageId: string) => {
        dispatch(chatActions.setReplyMessageId(messageId));
        dispatch(chatActions.setMode(Mode.Reply));
        inputTextFocus && inputTextFocus();
    };

    const setForwardMessageIdsHandler = (messageIds: string[]) => {
        dispatch(chatActions.setForwardMessageIds(messageIds));
        dispatch(chatActions.setMode(Mode.Forward_SelectChat));
    };

    return (
        <ContextMenu items={getContextMenuItems()}>
            {children as any as JSX.Element}
        </ContextMenu>
    );
};
