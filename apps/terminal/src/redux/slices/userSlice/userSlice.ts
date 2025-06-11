'use client';

import { createSlice } from '@reduxjs/toolkit'
import { createItemStorage } from '../../../utils/storage';

export interface IUser {
    id?: number,
    photo?: string,
    nombre?: string,
    correo?: string,
    createdAt?: string,
    phoneWithCountry?: string;
    company_name?: string;
}

interface IUserSlice {
    user: IUser
    loadingApi: boolean
}

const initialState : IUserSlice = {
    user: {},
    loadingApi: false
}

export const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    onLoadUser: (_, {payload}) => {      
      createItemStorage('token', payload)
    },
    onLoadUserInfo: (state, {payload}) => {
      state.user = payload
    }
  },
})

export const { onLoadUser, onLoadUserInfo } = userReducer.actions

export default userReducer.reducer