import programmesData from '@/data/programmes.json';
import { Programme } from './types';

const CMS_PROVIDER = process.env.CMS_PROVIDER ?? 'local';
const CMS_BASE_URL = process.env.CMS_BASE_URL;

async function fetchFromStrapi(): Promise<Programme[]> {
  if (!CMS_BASE_URL) return programmesData as Programme[];
  const response = await fetch(`${CMS_BASE_URL}/api/programmes?populate=*`, { cache: 'no-store' });
  if (!response.ok) return programmesData as Programme[];
  const payload = await response.json();
  return payload.data.map((item: any) => ({
    slug: item.attributes.slug,
    title: item.attributes.title,
    shortDescription: item.attributes.shortDescription,
    fullDescription: item.attributes.fullDescription,
    category: item.attributes.category,
    duration: item.attributes.duration,
    nqfLevel: item.attributes.nqfLevel,
    credits: item.attributes.credits,
    outcomes: item.attributes.outcomes,
    requirements: item.attributes.requirements,
    certification: item.attributes.certification,
    featured: item.attributes.featured
  }));
}

async function fetchFromPocketBase(): Promise<Programme[]> {
  if (!CMS_BASE_URL) return programmesData as Programme[];
  const response = await fetch(`${CMS_BASE_URL}/api/collections/programmes/records?sort=title`, { cache: 'no-store' });
  if (!response.ok) return programmesData as Programme[];
  const payload = await response.json();
  return payload.items as Programme[];
}

export async function getProgrammes(): Promise<Programme[]> {
  if (CMS_PROVIDER === 'strapi') return fetchFromStrapi();
  if (CMS_PROVIDER === 'pocketbase') return fetchFromPocketBase();
  return programmesData as Programme[];
}

export async function getProgrammeBySlug(slug: string): Promise<Programme | undefined> {
  const programmes = await getProgrammes();
  return programmes.find((programme) => programme.slug === slug);
}
