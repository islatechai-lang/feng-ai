import { PricingPlanDetail } from "@/types";

export const PRICING_PLANS: PricingPlanDetail[] = [
  {
    id: "single_room",
    name: "Single Room Unlock",
    priceUSD: 3.99,
    priceLabelUSD: "$3.99",
    billingPeriod: "once",
    features: [
      "Full unlocked AI room transformation (Before/After slider)",
      "Interactive annotated photo with issue pins",
      "SVG 2D Floor Plan layout diagram (Before vs After)",
      "Complete categorized issue list & remedies",
      "Personalized 5-Elements & Lucky Directions guide",
      "TikTok & IG Stories 9:16 Share Card",
      "Permanent access to this room analysis",
    ],
  },
  {
    id: "weekly_pass",
    name: "Mover's Weekly Pass",
    priceUSD: 4.99,
    priceLabelUSD: "$4.99 / week",
    billingPeriod: "week",
    isPopular: true,
    features: [
      "Everything in Single Room Unlock",
      "Unlimited room analyses for 7 days (Bedrooms, Offices, Living, Kitchen)",
      "Compare multiple furniture layouts & configurations",
      "Family & Partner Kua compatibility calculator",
      "Auspicious move-in dates checklist",
      "Priority AI image generation pipeline",
    ],
  },
  {
    id: "pro_yearly",
    name: "Feng Shui Pro Annual",
    priceUSD: 29.99,
    priceLabelUSD: "$29.99 / year",
    billingPeriod: "year",
    bestValue: true,
    features: [
      "Unlimited analyses all year round",
      "Full Bagua whole-home balance report",
      "Seasonal Feng Shui adjustments (Solstices & Equinoxes)",
      "High-resolution 4K image downloads with no watermark",
      "Early access to Floor-plan 3D scan mode",
      "Dedicated Feng Shui consultant review (v2)",
    ],
  },
];

export interface RegionalPricing {
  currency: string;
  symbol: string;
  singleRoom: { price: number; label: string };
  weeklyPass: { price: number; label: string };
  proYearly: { price: number; label: string };
}

export const REGIONAL_PRICING: Record<string, RegionalPricing> = {
  PH: {
    currency: "PHP",
    symbol: "₱",
    singleRoom: { price: 119, label: "₱119" },
    weeklyPass: { price: 149, label: "₱149" },
    proYearly: { price: 899, label: "₱899" },
  },
  ID: {
    currency: "IDR",
    symbol: "Rp ",
    singleRoom: { price: 32000, label: "Rp 32.000" },
    weeklyPass: { price: 40000, label: "Rp 40.000" },
    proYearly: { price: 240000, label: "Rp 240.000" },
  },
  IN: {
    currency: "INR",
    symbol: "₹",
    singleRoom: { price: 169, label: "₹169" },
    weeklyPass: { price: 219, label: "₹219" },
    proYearly: { price: 1299, label: "₹1,299" },
  },
  MY: {
    currency: "MYR",
    symbol: "RM",
    singleRoom: { price: 9.9, label: "RM 9.90" },
    weeklyPass: { price: 12.9, label: "RM 12.90" },
    proYearly: { price: 79.0, label: "RM 79.00" },
  },
};
