import { mkdirSync } from 'fs';
import { join, resolve } from 'path';

export const uploadsDirectory = resolve(
  process.env.UPLOADS_DIR ?? join(process.cwd(), 'uploads'),
);

mkdirSync(uploadsDirectory, { recursive: true });
