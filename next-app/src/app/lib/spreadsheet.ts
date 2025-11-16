import Papa from 'papaparse';

// Type definitions remain the same
export type WorkItem = {
  title: string;
  description: string;
  type: 'soundcloud' | 'youtube';
  src: string;
};

export type DiscographyItem = {
  title:string;
  type: string;
  description: string;
  url: string;
  imageUrl: string | null;
};

export type DiscographyData = {
  [year: string]: DiscographyItem[];
};

const SPREADSHEET_ID = '1Kg4U1YVHSAlR2Q5dayDQOIPCrTocHaDSjtIlTh47L5I';
const WORKS_GID = '0';
const DISCOGRAPHY_GID = '33803131';

const WORKS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${WORKS_GID}`;
const DISCOGRAPHY_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${DISCOGRAPHY_GID}`;

/**
 * Fetches and parses a public Google Sheet CSV from a given URL using Papaparse.
 */
async function fetchAndParseCsv<T>(url: string): Promise<T[]> {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<T>(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });

  } catch (error) {
    console.error(`Error fetching or parsing CSV from ${url}:`, error);
    return [];
  }
}

// Fetches and parses the 'works' sheet
export const getWorks = async (): Promise<WorkItem[]> => {
  const works = await fetchAndParseCsv<WorkItem>(WORKS_CSV_URL);
  return works
    .filter(item => item.title && item.src)
    .map(item => ({
      ...item,
      type: item.type === 'youtube' ? 'youtube' : 'soundcloud',
    }));
};

// Fetches and parses the 'discography' sheet
export const getDiscography = async (): Promise<DiscographyData> => {
  type DiscographyRow = DiscographyItem & { year: string };
  const items = await fetchAndParseCsv<DiscographyRow>(DISCOGRAPHY_CSV_URL);

  const discography: DiscographyData = {};

  items.forEach(item => {
    if (item.year && item.title) {
      // Papaparse with dynamicTyping might convert year to number, so convert it back to string.
      const yearStr = String(item.year);
      if (!discography[yearStr]) {
        discography[yearStr] = [];
      }
      discography[yearStr].push({
        title: item.title,
        type: item.type,
        description: item.description,
        url: item.url,
        imageUrl: item.imageUrl || null,
      });
    }
  });

  return discography;
};
