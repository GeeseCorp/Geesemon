import {User} from "../auth/types";
import {Entity} from "../../common/types";

export type Message = {
    text?: string | null
    fromId?: string | null
    from?: User | null
    chatId: string
    readMessages: ReadMessage[]
} & Entity

export type ReadMessage = {
    messageId: string
    message: Message
    readById: string
    readBy: User
}