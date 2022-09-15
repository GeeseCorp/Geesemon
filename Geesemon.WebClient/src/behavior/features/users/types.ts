import { Entity } from "../../common";

export type User = {
    firstName: string
    lastName: string
    login: string
    email: string
    phoneNumber : string
    description: string
    dateOfBirth: string
    role: Role
    imageUrl?: string
    avatarColor: string
} & Entity;

export enum Role{
    Admin = 'ADMIN',
    User = 'USER',
}
