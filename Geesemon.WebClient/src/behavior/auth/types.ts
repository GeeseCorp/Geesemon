export type User = {
  id: string;
  lastName: string;
  firstName: string;
  login: string;
  email: string;
  description: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  dateOfBirth: Date;
  role: UserRole;
};

export type MeQueryResponse = {
  auth: {
    me: AuthResponseType;
  };
};

export type LoginQueryResponse = {
  auth: {
    login: AuthResponseType;
  };
};

export type RegisterQueryResponse = {
  auth: {
    register: AuthResponseType;
  };
};

export type AuthResponseType = {
  user: User;
  token: string;
};

export type LoginRequest = {
  login: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  login: string;
  email: string;
  password: string;
};

export enum UserRole {
  admin,
  user,
}
