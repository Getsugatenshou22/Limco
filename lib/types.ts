export type ProgrammeCategory = 'IT' | 'Business' | 'Finance' | 'Compliance' | 'Leadership';

export interface Programme {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ProgrammeCategory;
  duration: string;
  nqfLevel?: string;
  credits?: number;
  outcomes: string[];
  requirements: string[];
  certification: string;
  featured?: boolean;
}
