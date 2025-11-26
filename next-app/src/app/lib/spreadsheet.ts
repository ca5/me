import Papa from 'papaparse';
import fs from 'fs/promises';
import path from 'path';
import { google, drive_v3 } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { Writable } from 'stream';

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

  // The directory where images will be saved
  const imageDir = path.join(process.cwd(), 'public', 'img', 'googledrive');
  await fs.mkdir(imageDir, { recursive: true });

  // --- Google Drive API Setup ---
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  let drive: drive_v3.Drive | null; // Define drive client here

  if (credentialsJson) {
    try {
      const auth = new GoogleAuth({
        credentials: JSON.parse(credentialsJson),
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      });
      drive = google.drive({ version: 'v3', auth });
    } catch (error) {
      console.warn('Could not initialize Google Drive API. Skipping image downloads.', error);
      drive = null;
    }
  } else {
    console.warn('GOOGLE_APPLICATION_CREDENTIALS_JSON is not set. Skipping Google Drive image downloads.');
    drive = null;
  }

  const processedItems = await Promise.all(items.map(async (item) => {
    // Only process if the API client is available and the URL is a Google Drive link
    if (drive && item.imageUrl && item.imageUrl.startsWith('https://drive.google.com/')) {
      try {
        // Extract file ID from the URL
        const fileIdMatch = item.imageUrl.match(/id=([a-zA-Z0-9_-]+)/);
        if (!fileIdMatch) throw new Error('Could not parse file ID from URL');
        const fileId = fileIdMatch[1];

        // Get file metadata to determine the extension
        const { data: fileMetadata } = await drive.files.get({ fileId, fields: 'mimeType' });
        const mimeType = fileMetadata.mimeType;
        const extensionMap: { [key: string]: string } = {
          'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif',
        };
        const extension = mimeType ? extensionMap[mimeType] : '.jpg';

        // Download the file content
        const { data: fileStream } = await drive.files.get(
          { fileId, alt: 'media' },
          { responseType: 'stream' }
        );

        // Convert stream to buffer
        const chunks: Buffer[] = [];
        const buffer = await new Promise<Buffer>((resolve, reject) => {
          const writable = new Writable({
            write(chunk, encoding, callback) {
              chunks.push(Buffer.from(chunk));
              callback();
            },
          });
          writable.on('finish', () => resolve(Buffer.concat(chunks)));
          writable.on('error', reject);
          fileStream.pipe(writable);
        });

        // Sanitize title for filename: replace spaces with underscores and remove invalid characters.
        const sanitizedTitle = item.title
          .replace(/\s+/g, '_') // Replace spaces with underscores
          .replace(/[\\/:*?"<>|()]/g, ''); // Remove invalid filesystem chars and parentheses
        const filename = `${item.year}-${sanitizedTitle}-${fileId}${extension}`;
        const localPath = path.join(imageDir, filename);

        await fs.writeFile(localPath, buffer);
        item.imageUrl = `/img/googledrive/${filename}`;

      } catch (error) {
        console.error(`Failed to download image for "${item.title}" (URL: ${item.imageUrl}):`, error);
        item.imageUrl = null;
      }
    }
    return item;
  }));

  const discography: DiscographyData = {};
  processedItems.forEach(item => {
    if (item.year && item.title) {
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
