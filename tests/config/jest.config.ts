import path from 'path';
import type { JestConfigWithTsJest } from 'ts-jest';

const projectRoot = path.resolve(__dirname, '../..');

const config: JestConfigWithTsJest = {
  rootDir: projectRoot,
  clearMocks: false,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/jest/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tests/tsconfig.json'
      }
    ]
  },
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@components$': '<rootDir>/src/components',
    '^@pages$': '<rootDir>/src/pages',
    '^@selectors$': '<rootDir>/src/services/selectors',
    '^@slices$': '<rootDir>/src/services/slices',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@utils-types$': '<rootDir>/src/utils/types.ts'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/services/slices/ingredients-slice.ts',
    '<rootDir>/src/services/slices/burger-constructor-slice.ts'
  ],
  coverageProvider: 'v8',
  coverageReporters: ['text']
};

export default config;
