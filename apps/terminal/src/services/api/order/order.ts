import ApiInstance from "../../axios/configAxios"


export const getOrdersUser = async(offset: number, limit: number) => {
    const {data} = await ApiInstance.get(`api/order?offset=${offset}&limit=${limit}`)

    return data
}

export const deleteOrder = async(orderId : number) => {
    const {data} = await ApiInstance.delete('api/order/'+ orderId)

    return data
}