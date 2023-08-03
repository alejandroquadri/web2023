import { Producto } from './product.interface';

export interface CartItem {
  product: Producto;
  quantity: number;
  excess: number;
  subTotal: number;
  totalQ: number;
  boxes: number;
  units: number;
  imageUrl?: string;
  isComplement: boolean;
}

export interface CompObj {
  grout?: number;
  glue?: number;
  impPol?: number;
  impAc?: number;
  sop?: number;
}

export interface QObj {
  m2Placa: number;
  m2Pt: number;
  m2Rus: number;
  ml: number;
  m2Ext: number;
  subTotal: number;
}
