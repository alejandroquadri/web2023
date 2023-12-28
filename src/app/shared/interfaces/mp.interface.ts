export interface MPitem {
  title: string;
  quantity: number;
  unit_price: number;
  catalog_product_id?: string;
  picture_url?: string;
  description?: string;
  id?: string;
}

export interface MPshipments {
  mode: string; //'me2';
  local_pickup?: boolean;
  free_methods?: Array<any>;
  free_methods_types?: Array<any>;
}
