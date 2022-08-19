export type UserBase = {
  id: string;
  lastName: string;
  firstName: string;
};

export type GetAllQueryResponseType = {
  user: {
    getAll: UserBase[];
  };
};
