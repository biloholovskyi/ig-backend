// Integration test environment setup
// This file is loaded via setupFiles in vitest.config.ts
// It runs in the test environment and sets env vars for all integration tests

process.env.DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5433/instagallery_test'
process.env.DIRECT_URL =
  'postgresql://postgres:postgres@localhost:5433/instagallery_test'
