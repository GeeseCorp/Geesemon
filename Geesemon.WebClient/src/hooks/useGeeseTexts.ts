import { useAppSelector } from '../behavior/store';
import { GeeseText } from '../utils/textUtils';

export function useGeeseTexts() {  
    const texts = useAppSelector(state => state.settings.geeseTexts);    
    const result : Record<string, GeeseText> = {};

    for (let i = 0; i < texts.length; i++) {
        result[texts[i].key] = texts[i].value as GeeseText;
    }

    return result;
}