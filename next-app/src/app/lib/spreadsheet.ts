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

const SPREADSHEET_PUB_ID = '2PACX-1vQt6Gfu28w-60QiOb57bhw-pyd9i66nA4leISszI-O8B-tDGdw-MYp6ojlt2FQgGy3vzi9nos0kyZcF';
const WORKS_GID = '1772800433';
const DISCOGRAPHY_GID = '0';

const WORKS_CSV_URL = `https://docs.google.com/spreadsheets/d/e/${SPREADSHEET_PUB_ID}/pub?gid=${WORKS_GID}&single=true&output=csv`;
const DISCOGRAPHY_CSV_URL = `https://docs.google.com/spreadsheets/d/e/${SPREADSHEET_PUB_ID}/pub?gid=${DISCOGRAPHY_GID}&single=true&output=csv`;

/**
 * Fetches and parses a public Google Sheet CSV from a given URL using Papaparse.
 */
async function fetchAndParseCsv<T>(url: string): Promise<T[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvText = await response.text();
    console.log("Fetched CSV Text:", csvText); // Log the fetched CSV text

    return new Promise((resolve, reject) => {
      Papa.parse<T>(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("Parsed Data:", results.data); // Log the parsed data
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
