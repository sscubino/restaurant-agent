export interface ICreateTable {
  name: string;
  capacity: number;
  isAvailable: boolean;
}

export interface IEditTable {
  name?: string;
  capacity?: number;
  isAvailable?: boolean;
}
