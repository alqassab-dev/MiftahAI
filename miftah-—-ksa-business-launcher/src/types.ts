export type Language = 'en' | 'ar';

export interface SectorInsight {
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  keyLicense: string;
  saudizationLevel: 'Low' | 'Medium' | 'High';
  marketTrend: string;
}

export interface Resource {
  name: string;
  description: string;
  link: string;
  category: 'Government' | 'Funding' | 'Support' | 'Tools';
}

export interface QuickTopic {
  title: string;
  description: string;
  importance: string;
}

export interface BusinessInfo {
  idea: string;
  nationality: string;
  city: string;
  budget: string;
  sector: string;
}

export interface RoadmapStep {
  title: string;
  description: string;
  cost?: string;
  authority?: string;
  link?: string;
}

export interface Supplier {
  name: string;
  service: string;
  link?: string;
}

export interface RoadmapPhase {
  name: string;
  description: string;
  estimatedCost: string;
  steps: RoadmapStep[];
}

export interface Roadmap {
  title: string;
  summary: string;
  totalEstimatedCost: string;
  phases: RoadmapPhase[];
  suppliers: Supplier[];
  advice: string;
}

export interface NewsItem {
  id: string;
  title: string;
  arabicTitle: string;
  date: string;
  category: string;
  arabicCategory: string;
  summary: string;
  arabicSummary: string;
  link: string;
}
