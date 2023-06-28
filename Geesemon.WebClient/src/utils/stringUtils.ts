export const getFirstAndLastName = (name: string) => {
    const parts = name?.split(' ')[0] || [];
    const firstName = parts.length ? parts[0] : '';
    const lastName = parts.length > 1 ? parts[1] : '';
    return [firstName, lastName] as const;
};

export const isGuidEmpty = (guid: string): boolean => {
    return guid === '00000000-0000-0000-0000-000000000000';
};

export const getFileName = (str: string): string => {
    const parts = str.split('/');
    if (!parts.length)
        return '';
    const lastPart = parts[parts.length - 1];
    return lastPart.substring(37);
};

export const getFileExtension = (str: string): string => {
    const parts = str.split('.');
    if (!parts.length)
        return '';
    const lastPart = parts[parts.length - 1];
    return lastPart.substring(1);
};

export const format = (text: string, ...args: (string | null | undefined)[]) => {
    return text.replace(/{(\d+)}/g, (match, number) => args[number] || match);
};