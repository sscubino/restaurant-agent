import ApiInstance from "../../axios/configAxios"


export const findAll = async () => {
    const { data } = await ApiInstance.get('api/dishes')
    console.log('res', data);
    
    return data
}

export const find = async () => {
    const { data } = await ApiInstance.get('api/dishes')
    return data
}

export const create = async ({
    name,
    price,
    desc
} : 
{
    name: string,
    price: number,
    desc: string
}) => {
    const { data } = await ApiInstance.post('api/dishes', {name, price, desc})
    return data
}

export const update = async ({
    id,
    name,
    price,
    desc,
    availability
} : 
{
    id?: number,
    name?: string;
    price?: number;
    desc?: string;
    availability?: boolean;
}) => {
    const { data } = await ApiInstance.put('api/dishes/' + id , {name, price, desc, availability} )
    return data
}

export const remove = async (id : number) => {
    const { data } = await ApiInstance.delete('api/dishes/'+ id)
    return data
}