export interface Producto {
  key?: string;
  color?: string;
  codigo: string;
  descripcion: string;
  dimension: string;
  eq: number;
  eqEcom: number;
  eqSinCorte: number;
  eqPrensa?: number;
  familia: string;
  marca: string;
  moneda: 'Pesos' | 'Dólares';
  precioActual: number;
  precioEcom: number;
  precioCajaEcom?: number;
  rutaProduccion?: string;
  spPrensa: string;
  spTerminacion: string;
  spCorte: string;
  spBisel: string;
  dimPrensa: string;
  stock: Record<string, Stock>;
  terminacion?: string;
  tipo: Tipo;
  tipoIva?: 10.5 | 21 | 27 | 0;
  unidad: string;
  unidadStock: string;
  suspendido: boolean;
  uPorBulto: number;
  packaging: string;
  porIva?: number;
  imputacionCompra?: string;
  imputacionVenta?: string;
  cuentaIngresos?: string;
  cuentaEgresos?: string;
}

export interface Stock {
  disp: number;
  res: number;
}

export type Tipo =
  | 'producto'
  | 'producto reventa'
  | 'servicio'
  | 'concepto'
  | 'compra servicio'
  | 'insumo'
  | 'materia prima'
  | 'muestras';
