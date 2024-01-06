import { gql } from '@apollo/client';

export const searchChatsQuery = gql`
 query ($keywords: String!, $paging: PagingType!) {
  search {
    chats(keywords: $keywords, paging: $paging) {
      id
      identifier
      name
      type
      imageUrl
      imageColor
    }
  }
}
`;
