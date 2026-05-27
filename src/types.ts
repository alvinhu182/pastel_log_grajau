export type CategoryType = 'salgado' | 'doce' | 'bebida' | 'acompanhamento';

export interface Product {
  id: string;
  name: string;
  version: string;
  category: CategoryType;
  description: string;
  price: number;
  tags: string[];
  originalIngredients: string[];
  sizeMultiplier?: {
    P: number; // Sandbox (small)
    M: number; // Staging (medium)
    G: number; // Production (large)
  };
}

export type PastelSize = 'P' | 'M' | 'G';

export interface OrderItem {
  id: string; // Unique for this specific cart instance (considers item + size + customizations)
  product: Product;
  quantity: number;
  selectedSize: PastelSize;
  customIngredients?: string[]; // Custom variables/inputs added
}

export interface CommitLog {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  likes: number;
  hash: string;
}

export interface CustomCompilerState {
  baseSelected: string; // 'carne' or 'queijo' etc.
  extraIngredients: string[];
  customName: string;
}
