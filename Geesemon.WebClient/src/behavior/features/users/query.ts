import {gql} from "@apollo/client";

export const GetAllUsersQuery = gql`
    query {
        user {
            getAll {
                id
                firstName
                lastName
            }
        }
    }
`;
