import { AuthResponseType } from './types';
import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../users/fragments';

export type LoginViaQrCodeData = { loginViaToken: { authResponse: AuthResponseType } };
export type LoginViaQrCodeVars = { token: string };
export const LOGIN_VIA_QR_CODE_SUBSCRIPTIONS = gql`
    ${USER_FRAGMENT}
    subscription ($token: String!) {
      loginViaToken(token: $token) {
        authResponse {
          user {
            ...UserFragment
          }
          token
        }
      }
    }
`;