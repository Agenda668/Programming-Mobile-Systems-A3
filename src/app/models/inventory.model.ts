export enum Category {
  Electronics = 'Electronics',
  Furniture = 'Furniture',
  Clothing = 'Clothing',
  Tools = 'Tools',
  Other = 'Other',
}

export enum StockStatus {
  InStock = 'InStock',
  LowStock = 'LowStock',
  OutOfStock = 'OutOfStock',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.Electronics]: '电子',
  [Category.Furniture]: '家具',
  [Category.Clothing]: '服装',
  [Category.Tools]: '工具',
  [Category.Other]: '其他',
};

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  [StockStatus.InStock]: '有货',
  [StockStatus.LowStock]: '低库存',
  [StockStatus.OutOfStock]: '缺货',
};

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

export interface InventoryApiItem {
  item_id: number;
  item_name: string;
  category: Category;
  quantity: number;
  price: number;
  supplier: string;
  stock_status: StockStatus;
  featured_item: boolean;
  special_note?: string;
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

export interface InventoryApiPayload {
  item_name?: string;
}

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

export function mapApiItemToInventoryItem(item: InventoryApiItem): InventoryItem {
  return {
    id: item.item_id,
    name: item.item_name,
    category: item.category,
    quantity: item.quantity,
    price: item.price,
    supplier: item.supplier,
    status: item.stock_status,
    featured: item.featured_item,
    note: item.special_note,
  };
}

export function mapInventoryCreateToApiPayload(item: InventoryCreatePayload): InventoryApiPayload {
  return {
    item_name: item.name,
  };
}

export function mapInventoryUpdateToApiPayload(item: InventoryUpdatePayload): InventoryApiPayload {
  return {
    item_name: item.name,
  };
}
