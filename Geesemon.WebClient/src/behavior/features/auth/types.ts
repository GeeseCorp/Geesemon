import { User } from "../users/types";

export type AuthResponseType = {
    user: User
    token: string
};

