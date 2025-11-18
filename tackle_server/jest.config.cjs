module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@prisma/client$': '<rootDir>/__mocks__/prisma.ts',
  },
}
