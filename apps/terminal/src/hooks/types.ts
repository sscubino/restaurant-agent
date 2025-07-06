export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  inviteCode?: string;
}

export interface ILogin {
  email: string;
  password: string;
}
