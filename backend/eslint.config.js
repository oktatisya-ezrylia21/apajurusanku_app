// Konfigurasi lint dasar: aturan rekomendasi ESLint untuk kode Node.js.
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  { languageOptions: { globals: globals.node } },
];
