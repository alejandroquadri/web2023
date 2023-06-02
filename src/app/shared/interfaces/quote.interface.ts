export interface Quote {
  key?: string;
  createdAt?: any;
  updatedAt?: any;
  calcIVA: number;
  calcPIIBB?: number;
  currency?: 'Pesos' | 'Dólares';
  date: string;
  iibb: number;
  iva: number;
  name: string;
  email?: string;
  phone?: number;
  base64Pdf?: any;
  number: number;
  payment: string;
  salesman: string;
  subtotal: number;
  origin: 'app' | 'web';
  total: number;
  items: Array<QuoteItem>;
  query?: any;
  project: Record<string, boolean> | null;
}

export interface QuoteItem {
  code: string;
  color?: string | null;
  currency: string;
  description: string;
  discount: number;
  finalPrice: number;
  price: number;
  quantity: number;
  quantityNl: number;
  unit: string;
  side1?: number | null;
  side2?: number | null;
  total: number;
}
