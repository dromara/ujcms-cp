import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

// Import your mock .ts files one by one
// If you use vite.mock.config.ts, just import the file directly
// You can use the import.meta.glob function to import all
const modules: Record<string, any> = import.meta.glob('./**/*.ts', {
  import: 'default',
  eager: true,
});

const mockModules = Object.keys(modules).reduce((pre, key) => {
  if (!key.includes('/_')) {
    pre.push(...modules[key]);
  }
  return pre;
}, [] as any[]);

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
