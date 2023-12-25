import { gql } from '@apollo/client';
import { GeeseText, Language } from './types';

export type LanguageGetData = { geeseTexts: { getLanguages: Language[] } };
export const LANGUAGES_GET_QUERY = gql`
    query GetLanguages {
        geeseTexts {
            getLanguages{
                code
                name
                flagUrl
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
