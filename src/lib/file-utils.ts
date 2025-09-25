import fs from 'fs/promises';
import path from 'path';

/**
 * Saves a file to the local filesystem.
 * @param file - The file to save.
 * @param name - A name to use for generating a unique filename (e.g., user's name).
 * @returns The path where the file was saved, or null if an error occurred.
 */
export async function saveLocalFile(file: File, name: string): Promise<string | null> {
  try {
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const uniqueFileName = `${Date.now()}_${name.replace(/\s/g, '')}_${file.name}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    return filePath;
  } catch (error) {
    console.error('Error saving local file:', error);
    return null;
  }
}
