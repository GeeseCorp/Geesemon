import { gql } from '@apollo/client';
import { GeeseText } from './types';

export type LanguageGetData = { geeseTexts: { getLanguages: GeeseText[] } };
export const LANGUAGES_GET_QUERY = gql`
    query GetLanguages {
        geeseTexts {
            getLanguages{
                key,
                value
            }
        }
    }  
`;

export type GeeseTextsGetData = { geeseTexts: { getTexts: GeeseText[] } };
export const GEESETEXTS_GET_QUERY = gql`
    query GetGeeseTexts {
        geeseTexts {
            getTexts{
                key,
                value
            }
        }
    }  
`;
