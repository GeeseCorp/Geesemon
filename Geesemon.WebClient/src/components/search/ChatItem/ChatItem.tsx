import s from './ChatItem.module.scss';
import { Avatar } from '../../common/Avatar/Avatar';
import { AvatarWithoutImage } from '../../common/AvatarWithoutImage/AvatarWithoutImage';
import { Chat } from '../../../behavior/features/search/types';

type Props = {
  chat: Chat;
  onClickChat: (chatIdentifier: string) => void;
};

export const ChatItem = ({ chat, onClickChat }: Props) => (
  <div
    className={s.chat}
    onClick={() => onClickChat(chat.identifier)}
  >
    <div className={s.chatInner}>
      <div className={s.avatar}>
        {chat.imageUrl
          ? <Avatar imageUrl={chat.imageUrl} width={54} height={54} />
          : (
            <AvatarWithoutImage
              name={chat.name || ''}
              backgroundColor={chat.imageColor}
              width={54}
              height={54}
            />
          )
        }
      </div>
      <div className={s.chatInfo}>
        <div className={s.chatTitle}>
          <div className={['bold', s.name].join(' ')}>{chat.name}</div>
        </div>
        <div className={s.chatSubtitle}>
          <span className="secondary">@{chat.identifier}</span>
        </div>
      </div>

    </div>
  </div>
);
