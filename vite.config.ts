/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

export default defineConfig(({ mode }) => {
  // 加载 .env 文件
  const env = loadEnv(mode, process.cwd());
  return {
    base: env.VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    server: {
      port: Number(env.VITE_PORT),
      proxy: {
        [env.VITE_BASE_API]: {
          target: env.VITE_PROXY,
          changeOrigin: true,
        },
        '/uploads': {
          target: env.VITE_PROXY,
          changeOrigin: true,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
    plugins: [
      vue(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      vueI18n({
        include: path.resolve(__dirname, './src/locales/**'),
      }),
    ],
  };
});
