import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'src/content/Docs');

export interface DocFile {
  title: string;
  slug: string[];
  path: string;
}

export interface DocCategory {
  name: string;
  files: DocFile[];
}

export function getDocsNavigation(): DocCategory[] {
  if (!fs.existsSync(DOCS_DIR)) return [];

  const categories: DocCategory[] = [];
  const dirs = fs.readdirSync(DOCS_DIR, { withFileTypes: true });

  for (const dir of dirs) {
    if (dir.isDirectory()) {
      const categoryPath = path.join(DOCS_DIR, dir.name);
      const categoryName = dir.name.replace(/_/g, ' ');
      
      const files = fs.readdirSync(categoryPath)
        .filter(f => f.endsWith('.md'))
        .map(f => {
          const fileName = f.replace('.md', '');
          return {
            title: fileName.replace(/_/g, ' '),
            slug: [dir.name, fileName],
            path: path.join(categoryPath, f)
          };
        });

      if (files.length > 0) {
        categories.push({
          name: categoryName,
          files
        });
      }
    } else if (dir.isFile() && dir.name.endsWith('.md')) {
      // Top level files like README.md
      const fileName = dir.name.replace('.md', '');
      categories.push({
        name: 'Root',
        files: [{
          title: fileName.replace(/_/g, ' '),
          slug: [fileName],
          path: path.join(DOCS_DIR, dir.name)
        }]
      });
    }
  }

  // Sort categories: put numbered ones first, sort by number
  categories.sort((a, b) => a.name.localeCompare(b.name));
  
  return categories;
}

export function getDocContent(slug: string[]): string | null {
  const filePath = path.join(DOCS_DIR, ...slug) + '.md';
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return null;
}
