export interface StripeItem {
  code: string;
  quantity: number;
  name: string;
  unit_price: number;
  description: string;
  picture_url?: string;
}

export interface StripeCustomerData {
  name: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  phone?: string | undefined;
}
