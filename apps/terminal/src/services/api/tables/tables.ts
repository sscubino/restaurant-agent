import ApiInstance from "../../axios/configAxios"
import { ICreateTable, IEditTable } from "./types"

export const create = async (dataCreate : ICreateTable) => {
    const { data } = await ApiInstance.post('api/table', dataCreate)
    return data
}

export const find = async (id : number) => {
    const { data } = await ApiInstance.get('api/table/'+ id)
    return data
}

export const findAll = async () => {
    const { data } = await ApiInstance.get('api/table')
    return data
}

export const update = async (tableId : number, dataEdit : IEditTable) => {
    const { data } = await ApiInstance.put('api/table/' + tableId , dataEdit)
    return data
}

export const remove = async (id : number) => {
    const { data } = await ApiInstance.delete('api/table/'+ id)
    return data
}
