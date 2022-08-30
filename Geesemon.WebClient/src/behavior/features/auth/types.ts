export type User = {
    id: string;
    lastName: string;
    firstName: string;
    login: string;
    email: string;
    imageUrl?: string | null;
    description?: string | null;
    phoneNumber?: string | null;
    createdAt: Date;
    updatedAt: Date;
    dateOfBirth?: Date | null;
    role: UserRole;
};

export enum UserRole {
    Admin = 'ADMIN',
    User = 'USER',
}

export type AuthResponseType = {
    user: User;
    token: string;
};

