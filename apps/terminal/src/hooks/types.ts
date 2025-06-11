
export interface ICreateUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: number | null;
    phone_country_code?: number | null
    company_name: string
}

export interface ILogin {
    email: string;
    password: string;
}
