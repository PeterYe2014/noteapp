const mockExecAsync = jest.fn(() => Promise.resolve());
const mockGetAllAsync = jest.fn(() => Promise.resolve([]));
const mockRunAsync = jest.fn(() =>
  Promise.resolve({ lastInsertRowId: 1, changes: 1 })
);

// Must mock before importing the module under test
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() =>
    Promise.resolve({
      execAsync: mockExecAsync,
      getAllAsync: mockGetAllAsync,
      runAsync: mockRunAsync,
    })
  ),
}));

// Reset module cache between tests so the singleton dbPromise is cleared
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('database', () => {
  describe('getDatabase', () => {
    it('should open the database and create the table', async () => {
      const { getDatabase } = require('../db/database');
      const SQLite = require('expo-sqlite');

      const db = await getDatabase();

      expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith('noteapp.db');
      expect(db).toBeDefined();
      expect(mockExecAsync).toHaveBeenCalledTimes(1);
      const sql = mockExecAsync.mock.calls[0][0] as string;
      expect(sql).toContain('CREATE TABLE IF NOT EXISTS notes');
    });

    it('should return the same instance on repeated calls', async () => {
      const { getDatabase } = require('../db/database');
      const SQLite = require('expo-sqlite');

      const db1 = await getDatabase();
      const db2 = await getDatabase();

      expect(db1).toBe(db2);
      expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe('initDatabase', () => {
    it('should ensure the table is created', async () => {
      const { initDatabase } = require('../db/database');

      await initDatabase();

      expect(mockExecAsync).toHaveBeenCalledTimes(1);
      const sql = mockExecAsync.mock.calls[0][0] as string;
      expect(sql).toContain('id TEXT PRIMARY KEY NOT NULL');
      expect(sql).toContain('content TEXT NOT NULL');
      expect(sql).toContain('createdAt INTEGER NOT NULL');
      expect(sql).toContain('updatedAt INTEGER NOT NULL');
      expect(sql).toContain('wordCount INTEGER NOT NULL');
    });
  });
});
