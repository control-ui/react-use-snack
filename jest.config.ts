import type { Config } from '@jest/types'

const packages: string[] = [
    'react-use-snack',
]

const base: Partial<Config.InitialOptions> = {
    transformIgnorePatterns: [
        'node_modules/?!(react-use-snack)',
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.tsx$': 'ts-jest',
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^react-use-snack(.*)$': '<rootDir>/packages/react-use-snack/src$1',
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    coveragePathIgnorePatterns: [
        '(tests/.*.mock).(jsx?|tsx?|ts?|js?)$',
        '.*.(test|spec).(js|ts|tsx)$',
        '<rootDir>/packages/.+/demo',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/packages/.+/build',
    ],
    watchPathIgnorePatterns: [
        '<rootDir>/.idea',
        '<rootDir>/.git',
        '<rootDir>/dist',
        '<rootDir>/node_modules',
        '<rootDir>/packages/.+/node_modules',
        '<rootDir>/packages/.+/build',
    ],
    modulePathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/packages/.+/build',
    ],
}

const config: Config.InitialOptions = {
    ...base,
    verbose: true,
    collectCoverage: true,
    projects: [
        ...packages.map(pkg => ({
            displayName: 'test-' + pkg,
            ...base,
            moduleDirectories: ['node_modules', '<rootDir>/packages/' + pkg + '/node_modules'],
            testMatch: [
                '<rootDir>/packages/' + pkg + '/src/**/*.(test|spec).(js|ts|tsx)',
                '<rootDir>/packages/' + pkg + '/tests/**/*.(test|spec).(js|ts|tsx)',
            ],
        })),
    ],
    coverageDirectory: '<rootDir>/coverage',
}

export default config
