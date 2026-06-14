export interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  logo: string;
  image?: string;
  badge?: string;
  category: string;
  shortDescription: string;
  description: string;
  monthlyPrice: number;
  originalPrice: number;
  deliveryTime: string;
  features: string[];
  deliveryMethod: string;
  rating: number;
  ratingCount: number;
}

export interface Bundle {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  savingPercent: number;
  products: string[]; // Product names or slugs
  toolsCount: number;
  colorTheme: 'creator' | 'pro' | 'ultimate';
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CategoryType = 'all' | 'writing' | 'chat' | 'code' | 'image' | 'video' | 'voice' | 'productivity' | 'design';
