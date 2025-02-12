import React from "react";

export interface UserIF {
  uid: string;
  created_at?: string;
  cellnum?: string;
  email?: string;
  wxid?: string;
  username?: string;
  nickname?: string;
  description?: string;
  avatar?: string;
  coins?: number;
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
  format: string[];
  creator_username?: string;
  creator_nickname?: string;
  creator_avatar?: string;
  purchase_price?: number;
  liked?: boolean;
  bookmarked?: boolean;
  deleted?: boolean;
}

export interface SubscriptionOptionIF {
  title: string;
  subtitle: string;
  subsubtitle: string;
  tier: string;
  price: number;
  subscribed: boolean;
  subscriptable: boolean;
  subscribe_price: number;
  features: string[];
}

export interface SubscriptionIF {
  before: string;
  after: string;
  amount: number;
  subscribed_at: string;
  next_billing_at: string;
  order_id: string;
}

export interface ReferIF {
  referrer_uid: string;
  referent_uid: string;
  referent_nickname?: string;
  referent_avatar?: string;
  bundle_id?: string;
  referred_at: string;
  coins_gained: number;
  refer_type: string;
}

export interface WxLoginProps {
  appid: string;
  scope?: string;
  redirect_uri: string;
  self_redirect?: boolean;
  state?: string;
  theme?: string;
  href?: string;
}
