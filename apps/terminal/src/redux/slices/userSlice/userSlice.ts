"use client";

import { createSlice } from "@reduxjs/toolkit";
import { createItemStorage } from "../../../utils/storage";

export interface IUser {
  id?: number;
  photo?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  restaurant?: {
    name: string;
    phone: string;
  };
  polarCustomer?: {
    id: string;
    subscriptions: { status: string }[];
  };
}

interface IUserSlice {
  user: IUser;
  loadingApi: boolean;
}

const initialState: IUserSlice = {
  user: {},
  loadingApi: false,
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    onLoadUser: (_, { payload }) => {
      createItemStorage("token", payload);
    },
    onLoadUserInfo: (state, { payload }) => {
      state.user = payload;
    },
  },
});

export const { onLoadUser, onLoadUserInfo } = userReducer.actions;

export default userReducer.reducer;
