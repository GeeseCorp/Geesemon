import {gql} from "@apollo/client";
import {USER_FRAGMENT} from "../users/fragments";

export const CHAT_FRAGMENT = gql`
    ${USER_FRAGMENT}
    fragment ChatFragment on ChatType {
        id
        name
        type
        imageUrl
        creatorId
        users {
            ...UserFragment
        }
        createdAt
        updatedAt
    }
`