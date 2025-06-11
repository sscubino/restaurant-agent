

export const createItemStorage = (key : string, value : any) => {
    localStorage.setItem(key, value)
}

export const getItemStorage = (key : string) => {
    return localStorage.getItem(key)
}

export const deleteItemStorage = (key : string) => {
    localStorage.removeItem(key)
}