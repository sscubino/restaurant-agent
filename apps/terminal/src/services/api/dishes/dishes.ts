import ApiInstance from "../../axios/configAxios";

export const findAll = async () => {
  const { data } = await ApiInstance.get("/menus");
  console.log("res", data);

  return data;
};

export const find = async () => {
  const { data } = await ApiInstance.get("/menus");
  return data;
};

export const create = async ({
  name,
  price,
  description,
}: {
  name: string;
  price: number;
  description: string;
}) => {
  const { data } = await ApiInstance.post("/menus", {
    name,
    price,
    description,
  });
  return data;
};

export const update = async ({
  id,
  name,
  price,
  description,
  isAvailable,
}: {
  id?: number;
  name?: string;
  price?: number;
  description?: string;
  isAvailable?: boolean;
}) => {
  const { data } = await ApiInstance.patch("/menus/" + id, {
    name,
    price,
    description,
    isAvailable,
  });
  return data;
};

export const remove = async (id: number) => {
  const { data } = await ApiInstance.delete("/menus/" + id);
  return data;
};
