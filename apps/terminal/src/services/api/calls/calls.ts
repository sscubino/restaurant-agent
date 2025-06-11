import ApiInstance from "../../axios/configAxios"


export const getAllCalls = async(offset: number, limit: number) => {
    const {data} = await ApiInstance.get(`api/calls?offset=${offset}&limit=${limit}`)

    return data
}