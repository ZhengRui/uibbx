export interface UserIF {
  uid: string;
  created_at?: string;
  cellnum?: string;
  email?: string;
  wxid?: string;
  username?: string;
  avatar?: string;
}

export interface BundleIF {
  id?: string;
  creator_uid?: string;
  created_at?: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  images: (File | string)[];
  bundle_url?: string;
  format: string;
  creator_username?: string;
}

export interface SubscriptionOption {
  title: string;
  subtitle: string;
  subsubtitle: string;
  price: number;
  subscribed: boolean;
  subscriptable: boolean;
  subscribe_price: number;
  features: string[];
}
