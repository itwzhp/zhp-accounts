import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    svelte({ 
      hot: !process.env.VITEST
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'zhp-accounts-types': fileURLToPath(new URL('../zhp-accounts-types', import.meta.url))
    },
    conditions: ['browser']
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    setupFiles: ['./src/setupTests.ts'],
    css: false,
    pool: 'vmThreads',
    server: {
      deps: {
        inline: [/^(?!.*vitest).*$/]
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,svelte}'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'node_modules'
      ]
    }
  }
})
