// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // 👈 مهم
    setupFiles: './vitest.setup.ts',
    globals: true, // ✅ این خط بسیار مهمه
  },
});
