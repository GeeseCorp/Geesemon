import { ChatKind } from '../chats';

export type Chat = {
  id: string;
  name: string;
  identifier: string;
  type: ChatKind;
  imageUrl?: string | null;
  imageColor: string;
};
