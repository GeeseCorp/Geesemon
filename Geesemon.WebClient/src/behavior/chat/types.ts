export type Message = {
  content: String;
  fromId: string;
  sentAt: Date;
};

export type MessageSubscriptionResponse = {
    messageAdded: Message;
}