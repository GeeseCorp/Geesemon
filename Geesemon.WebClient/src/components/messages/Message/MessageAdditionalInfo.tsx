import { ChatKind, Message } from '../../../behavior/features/chats/types';
import { useGeeseTexts } from '../../../hooks/useGeeseTexts';
import { useSelectedChat } from '../../../hooks/useSelectedChat';
import { getTimeWithoutSeconds } from '../../../utils/dateUtils';
import { Checks } from '../Checks/Checks';

type Props = {
    message: Message;
    isMessageMy: boolean;
    primary?: boolean;
} & JSX.IntrinsicElements['div'];

export const MessageAdditionalInfo = ({ message, isMessageMy, primary, ...rest }: Props) => {
    const T = useGeeseTexts();
    const selectedChat = useSelectedChat();

    return (
        <span {...rest}>
            {message.isEdited &&
                <span className={`small ${primary ? 'primary' : 'light'}`}>{T.Edited}</span>
            }
            <span className={`small ${primary ? 'primary' : 'light'}`}>
                {getTimeWithoutSeconds(new Date(message.createdAt))}
            </span>
            {isMessageMy && selectedChat?.type !== ChatKind.Saved && <Checks double={!!message.readBy?.length} />}
        </span>
    );
};