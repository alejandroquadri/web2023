export const UrlParser = {
  placas: 'placas',
  tiles: 'placas',
  'pisos-elevados': 'pisoTecnico',
  'piso-tecnico': 'pisoTecnico',
  'raised-floors': 'pisoTecnico',
  pavers: 'losetas',
  losetas: 'losetas',
  '12x50': '12x50',
  '60x40': '60x40',
  '64panes': '64panes',
};

export const CollectionUrlParser = {
  'pisos-elevados': 'raisedFloors',
  'raised-floors': 'raisedFloors',
  todos: 'all',
  all: 'all',
};

export const UnitsParser = {
  ecom: {
    M2: 'ft²',
    Ml: 'lft',
    Unidad: 'unit',
    'Bolsa 20 kg': '20 kg bag',
    'Bolsa 5 kg': '5 kg bag',
  },
  local: {
    M2: 'm²',
    Ml: 'ml',
    Unidad: 'unidad',
    'Bolsa 20 kg': 'Bolsa 20 kg',
    'Bolsa 5 kg': 'Bolsa 5 kg',
  },
};

export const DimParser = {
  '40x40': '16" x 16"',
  '10x40': '4" x 16"',
  '50x50': '20" x 20"',
  '10x50': '4" x 20"',
  zocalo: 'plynth 4" x 20"',
};
