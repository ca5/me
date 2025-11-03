import Papa from 'papaparse';

// Type definitions based on the original JSON structures
export type WorkItem = {
  title: string;
  description: string;
  type: 'soundcloud' | 'youtube';
  src: string;
};

export type DiscographyItem = {
  title: string;
  type: string;
  description: string;
  url: string;
  imageUrl: string | null;
};

export type DiscographyData = {
  [year: string]: DiscographyItem[];
};

const SPREADSHEET_ID = '1Kg4U1YVHSAlR2Q5dayDQOIPCrTocHaDSjtIlTh47L5I';

// Fetches and parses the 'works' sheet
export const getWorks = async (): Promise<WorkItem[]> => {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=0`;
  const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        const works = results.data as any[];
        resolve(
          works
            .filter(item => item.title && item.src) // Ensure essential fields are present
            .map(item => ({
              ...item,
              type: item.type === 'youtube' ? 'youtube' : 'soundcloud',
            }))
        );
      },
      error: (error: any) => {
        console.error('Error parsing works CSV:', error);
        reject(error);
      },
    });
  });
};

// Fetches and parses the 'discography' sheet
export const getDiscography = async (): Promise<DiscographyData> => {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=1628122396`;
  const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        const items = results.data as any[];
        const discography: DiscographyData = {};

        items.forEach(item => {
          if (item.year && item.title) {
            if (!discography[item.year]) {
              discography[item.year] = [];
            }
            discography[item.year].push({
              title: item.title,
              type: item.type,
              description: item.description,
              url: item.url,
              imageUrl: item.imageUrl || null,
            });
          }
        });
        resolve(discography);
      },
      error: (error: any) => {
        console.error('Error parsing discography CSV:', error);
        reject(error);
      },
    });
  });
};
