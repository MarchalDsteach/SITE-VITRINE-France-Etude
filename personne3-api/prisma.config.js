const { defineConfig } = require('@prisma/config');

module.exports = defineConfig({
  schema: './prisma/schema.prisma',
  engine: 'classic',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
