import { Entity } from '../../common';

export type User = {
  firstName: string;
  lastName: string;
  fullName: string;
  identifier: string;
  email: string;
  phoneNumber: string;
  description: string;
  dateOfBirth: string;
  role: Role;
  imageUrl?: string;
  avatarColor: string;
  lastTimeOnline: string;
  isOnline: boolean;
} & Entity;

export enum Role {
  Admin = 'ADMIN',
  User = 'USER',
}
