import ApiInstance from "../../axios/configAxios";
import { ICreateTable, IEditTable } from "./types";

export const create = async (dataCreate: ICreateTable) => {
  const { data } = await ApiInstance.post("/tables", dataCreate);
  return data;
};

export const find = async (id: number) => {
  const { data } = await ApiInstance.get("/tables/" + id);
  return data;
};

export const findAll = async () => {
  const { data } = await ApiInstance.get("/tables");
  return data;
};

export const update = async (tableId: number, dataEdit: IEditTable) => {
  const { data } = await ApiInstance.patch("/tables/" + tableId, dataEdit);
  return data;
};

export const remove = async (id: number) => {
  const { data } = await ApiInstance.delete("/tables/" + id);
  return data;
};
