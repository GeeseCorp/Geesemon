import { useAppSelector } from '../behavior/store';
import type { GeeseText } from '../utils/textUtils';

export function useGeeseTexts() {
    const texts = useAppSelector(state => state.settings.geeseTexts);
    const result: Record<string, GeeseText> = {};

    for (let i = 0; i < texts.length; i++) {
        result[texts[i].key] = texts[i].value as GeeseText;
    }

    return result;
}

export function useGetGeeseTexts(...args: (string | undefined | null)[]) {
    const texts = useAppSelector(state => state.settings.geeseTexts.filter(gs => args.includes(gs.key)));
    const result: (string | undefined)[] = [];

    for (let i = 0; i < texts.length; i++) {
        result.push(texts[i].value as GeeseText);
    }

    return result;
}