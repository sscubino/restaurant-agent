import ApiInstance from "../../axios/configAxios";

export const getCheckoutUrl = async (userId: string) => {
  const response = await ApiInstance.get(
    `/subscriptions/checkout?userId=${userId}`
  );
  return response.data;
};

export const getCustomerPortalUrl = async (userId: string) => {
  const response = await ApiInstance.get(
    `/subscriptions/customer-portal?userId=${userId}`
  );
  return response.data;
};
