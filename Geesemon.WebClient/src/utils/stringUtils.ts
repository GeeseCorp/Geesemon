export const getFirstAndLastName = (name: string) => {
    const parts = name?.split(' ')[0] || [];
    const firstName = parts.length ? parts[0] : '';
    const lastName = parts.length > 1 ? parts[1] : '';
    return [firstName, lastName] as const;
};

export const isGuidEmpty = (guid: string): boolean => {
    return guid === '00000000-0000-0000-0000-000000000000';
};