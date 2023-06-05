const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  verbose: true,
  testMatch: [
    '**/tests/**/*.test.ts',
  ],
};

export default config;
