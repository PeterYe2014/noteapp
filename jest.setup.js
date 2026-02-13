// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() =>
    Promise.resolve({
      execAsync: jest.fn(() => Promise.resolve()),
      getAllAsync: jest.fn(() => Promise.resolve([])),
      runAsync: jest.fn(() => Promise.resolve({ lastInsertRowId: 1, changes: 1 })),
    })
  ),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: 'Stack.Screen',
  },
  Tabs: {
    Screen: 'Tabs.Screen',
  },
  Link: 'Link',
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

// Silence console.error for expected errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
