/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    // Evita que o Jest tente rodar testes dentro do código gerado
    // pelo Prisma ou dentro de node_modules.
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/generated/'],
    setupFiles: ['<rootDir>/jest.setup.js'],
  };