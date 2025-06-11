declare namespace Express {
  export interface Request {
    user: {
      id: number;
      email: string;
    };
  }
}

// declare module 'express' {
//   interface Request {
//     user: {
//       id: number;
//       email: string;
//     };
//   }
// }

// export {};
