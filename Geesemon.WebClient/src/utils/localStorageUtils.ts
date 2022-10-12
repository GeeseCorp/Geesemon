export const AUTH_TOKEN_KEY = 'AUTH_TOKEN';

export const getAuthToken = (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
};