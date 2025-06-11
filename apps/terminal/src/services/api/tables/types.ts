export interface ICreateTable  {
    name: string;
    capacity: number;
    availability: boolean
}

export interface IEditTable  {
    name?: string;
    capacity?: number;
    availability?: boolean
}