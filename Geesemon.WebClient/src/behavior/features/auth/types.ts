import { User } from '../users/types';
import { Entity } from '../../common/types';

export type AuthResponseType = {
    user: User;
    token: string;
    session: Session;
};

export type Session = {
    isOnline: boolean;
    lastTimeOnline: string;
    ipAddress: string;
    userAgent: string;
    location: string;
} & Entity;

export type LoginQrCode = {
    qrCodeUrl: string;
    token: string;
};

