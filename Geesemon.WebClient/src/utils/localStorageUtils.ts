export type Key = 'AuthToken' | 'RecordingType';

export const localStorageGetItem = (key: Key): string | null => {
    return localStorage.getItem(key);
};

export const localStorageSetItem = (key: Key, value: string) => {
    localStorage.setItem(key, value);
};

export const localStorageRemoveItem = (key: Key) => {
    localStorage.removeItem(key);
};