export const getFirstAndLastName = (name: string) => {
    const parts = name?.split(' ')[0] || [];
    const firstName = parts.length ? parts[0] : '';
    const lastName = parts.length > 1 ? parts[1] : '';
    return [firstName, lastName] as const
}