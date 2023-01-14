const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageProvider: 'v8',
  verbose: true,
  testMatch: [
    '**/tests/**/*.test.ts',
  ],
};

export default config;
