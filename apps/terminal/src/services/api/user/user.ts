import ApiInstance from "../../axios/configAxios"


export const sendRequestNumber = async(info : any) => {
    const { data } = await ApiInstance.post('api/auth/sendRequestNumber', info)
    return data
}