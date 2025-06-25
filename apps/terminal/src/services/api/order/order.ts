import ApiInstance from "../../axios/configAxios";

export const getOrdersUser = async (offset: number, limit: number) => {
  const { data } = await ApiInstance.get(
    `/orders?skip=${offset}&take=${limit}`
  );

  return data;
};

export const deleteOrder = async (orderId: number) => {
  const { data } = await ApiInstance.delete("/orders/" + orderId);

  return data;
};
