import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    typecheck: {
      tsconfig: 'tsconfig.vitest.json',
    },
  },
})
