export enum Category {
  Electronics = '电子',
  Furniture = '家具',
  Clothing = '服装',
  Tools = '工具',
  Other = '其他',
}

export enum StockStatus {
  InStock = '有货',
  LowStock = '低库存',
  OutOfStock = '缺货',
}

export interface InventoryItem {
  id: number;
  name: string;
  category: Category;
  quantity: number;
  price: number;
  supplier: string;
  status: StockStatus;
  featured: boolean;
  note?: string;
}

export interface InventoryCreatePayload {
  name: string;
  category: Category;
  quantity: number;
  price: number;
  supplier: string;
  status: StockStatus;
  featured: boolean;
  note?: string;
}

export type InventoryUpdatePayload = Partial<InventoryCreatePayload>;

export const CATEGORY_OPTIONS: readonly Category[] = [
  Category.Electronics,
  Category.Furniture,
  Category.Clothing,
  Category.Tools,
  Category.Other,
] as const;

export const STOCK_STATUS_OPTIONS: readonly StockStatus[] = [
  StockStatus.InStock,
  StockStatus.LowStock,
  StockStatus.OutOfStock,
] as const;
