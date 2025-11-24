module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '^@prisma/client$': '<rootDir>/__mocks__/prisma.ts',
    '^\\.\\.\\/middlewares\\/auth\\.js$': '<rootDir>/middlewares/auth.ts',
    '^\\.\\.\\/routes\\/taskRoutes\\.js$': '<rootDir>/routes/taskRoutes.ts',
  },
}
