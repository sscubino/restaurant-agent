interface IProductsIds {
  productId: number;
  cantidad: number;
  detalle?: string;
}

export type createOrderDto = {
  direction?: string;
  productsIds?: IProductsIds[];
  typeOrder?: 'dine_in' | 'pick_up' | 'delivery';
  date?: string;
  tableId?: number;
  total?: number;
};
