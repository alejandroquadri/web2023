export interface StripeItem {
  code: string;
  quantity: number;
  unit_price: number;
  picture_url?: string;
  description?: string;
  id?: string;
}
