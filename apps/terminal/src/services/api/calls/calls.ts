import ApiInstance from "../../axios/configAxios";

export const getAllCalls = async (offset: number, limit: number) => {
  const { data } = await ApiInstance.get(
    `/phone-calls?skip=${offset}&take=${limit}`
  );

  return data;
};
