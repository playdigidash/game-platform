import { IFeatureDefinition } from '../PlanDefinition';

export interface PlanProps {
  mode: 'dashboard' | 'game-platform';
  redirectUrl?: string;
  title?: string;
}

export interface PlanActionHandlers {
  handleSubscribe: (planId: string) => void;
  handleDowngrade: () => void;
}

export interface IPlan {
  planId: string;
  name: string;
  originalPrice: number;
  discountPrice: number | null;
  planMonths: number;
  planYears: number;
  stripePriceId: string;
}

export interface LimitObject {
  value: number | null;
  display: string;
  highlight: string | null;
}

export interface IPlanFeatureMapping {
  planId: string;
  featureId: string | number;
  availability: boolean;
  limit: string | number | LimitObject;
  note?: string | null;
}

export interface MappedFeature {
  featureKey: string | number;
  availability: boolean;
  limit: string | number | LimitObject;
  note?: string | null;
  title: string;
  tooltip: string;
  isTopFeature: boolean;
  group: string;
}

export interface PlanWithFeatures {
  planId: string;
  name: string;
  originalPrice: number;
  discountPrice: number | null;
  features: MappedFeature[];
  groupedFeatures: Record<string, MappedFeature[]>;
  stripePriceId: string;
} 