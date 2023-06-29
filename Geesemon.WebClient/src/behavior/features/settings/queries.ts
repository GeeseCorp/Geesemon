import { gql } from '@apollo/client';
import { GeeseTextType } from './types';

export type LanguageGetData = { geeseTexts: { getLanguages: GeeseTextType[] } };
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

export type GeeseTextsGetData = { geeseTexts: { getTexts: GeeseTextType[] } };
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
