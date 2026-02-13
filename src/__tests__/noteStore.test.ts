import { useNoteStore } from '../store/noteStore';
import * as SQLite from 'expo-sqlite';

const mockRunAsync = jest.fn(() =>
  Promise.resolve({ lastInsertRowId: 1, changes: 1 })
);
const mockGetAllAsync = jest.fn(() => Promise.resolve([]));

// Update mock database for specific tests
jest.mocked(SQLite.openDatabaseAsync).mockResolvedValue({
  execAsync: jest.fn(() => Promise.resolve()),
  getAllAsync: mockGetAllAsync,
  runAsync: mockRunAsync,
} as any);

beforeEach(() => {
  useNoteStore.setState({ notes: [], isLoading: false });
  jest.clearAllMocks();
});

describe('noteStore', () => {
  describe('initial state', () => {
    it('should have empty notes array', () => {
      const state = useNoteStore.getState();
      expect(state.notes).toEqual([]);
    });

    it('should have isLoading as false', () => {
      const state = useNoteStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('addNote', () => {
    it('should add a new note with correct properties', async () => {
      const content = '这是一条测试笔记';

      await useNoteStore.getState().addNote(content);

      const state = useNoteStore.getState();
      expect(state.notes).toHaveLength(1);
      expect(state.notes[0].content).toBe(content);
      expect(state.notes[0].id).toBe('test-uuid-1234');
      expect(state.notes[0].wordCount).toBeGreaterThan(0);
      expect(state.notes[0].createdAt).toBeDefined();
      expect(state.notes[0].updatedAt).toBeDefined();
    });

    it('should calculate word count correctly', async () => {
      const content = '一 二 三 四 五';

      await useNoteStore.getState().addNote(content);

      const state = useNoteStore.getState();
      expect(state.notes[0].wordCount).toBe(5);
    });

    it('should add new notes at the beginning', async () => {
      useNoteStore.setState({
        notes: [
          {
            id: 'old-note',
            content: '旧笔记',
            createdAt: 1000,
            updatedAt: 1000,
            wordCount: 1,
          },
        ],
      });

      await useNoteStore.getState().addNote('新笔记');

      const state = useNoteStore.getState();
      expect(state.notes).toHaveLength(2);
      expect(state.notes[0].content).toBe('新笔记');
      expect(state.notes[1].content).toBe('旧笔记');
    });

    it('should set createdAt and updatedAt to the same value', async () => {
      await useNoteStore.getState().addNote('测试时间戳');

      const state = useNoteStore.getState();
      expect(state.notes[0].createdAt).toBe(state.notes[0].updatedAt);
    });

    it('should call database INSERT with correct parameters', async () => {
      await useNoteStore.getState().addNote('数据库测试');

      expect(mockRunAsync).toHaveBeenCalledTimes(1);
      const [sql, params] = mockRunAsync.mock.calls[0];
      expect(sql).toContain('INSERT INTO notes');
      expect(params[0]).toBe('test-uuid-1234'); // id
      expect(params[1]).toBe('数据库测试'); // content
      expect(typeof params[2]).toBe('number'); // createdAt
      expect(typeof params[3]).toBe('number'); // updatedAt
      expect(params[4]).toBe(5); // wordCount (5 CJK characters: 数据库测试)
    });

    it('should return the created note', async () => {
      const note = await useNoteStore.getState().addNote('返回值测试');

      expect(note).toBeDefined();
      expect(note.content).toBe('返回值测试');
      expect(note.id).toBe('test-uuid-1234');
    });

    it('should throw when database insert fails', async () => {
      mockRunAsync.mockRejectedValueOnce(new Error('DB error'));

      await expect(
        useNoteStore.getState().addNote('失败测试')
      ).rejects.toThrow('DB error');
    });

    it('should handle single character content', async () => {
      await useNoteStore.getState().addNote('A');

      const state = useNoteStore.getState();
      expect(state.notes[0].content).toBe('A');
      expect(state.notes[0].wordCount).toBe(1);
    });

    it('should handle content with multiple spaces', async () => {
      await useNoteStore.getState().addNote('hello   world');

      const state = useNoteStore.getState();
      expect(state.notes[0].wordCount).toBe(2);
    });
  });

  describe('deleteNote', () => {
    it('should remove note by id', async () => {
      useNoteStore.setState({
        notes: [
          {
            id: 'note-1',
            content: '笔记1',
            createdAt: 1000,
            updatedAt: 1000,
            wordCount: 1,
          },
          {
            id: 'note-2',
            content: '笔记2',
            createdAt: 2000,
            updatedAt: 2000,
            wordCount: 1,
          },
        ],
      });

      await useNoteStore.getState().deleteNote('note-1');

      const state = useNoteStore.getState();
      expect(state.notes).toHaveLength(1);
      expect(state.notes[0].id).toBe('note-2');
    });

    it('should handle deleting non-existent note', async () => {
      useNoteStore.setState({
        notes: [
          {
            id: 'note-1',
            content: '笔记1',
            createdAt: 1000,
            updatedAt: 1000,
            wordCount: 1,
          },
        ],
      });

      await useNoteStore.getState().deleteNote('non-existent');

      const state = useNoteStore.getState();
      expect(state.notes).toHaveLength(1);
    });

    it('should call database DELETE with correct id', async () => {
      useNoteStore.setState({
        notes: [
          {
            id: 'note-to-delete',
            content: '要删除的笔记',
            createdAt: 1000,
            updatedAt: 1000,
            wordCount: 1,
          },
        ],
      });

      await useNoteStore.getState().deleteNote('note-to-delete');

      expect(mockRunAsync).toHaveBeenCalledWith(
        'DELETE FROM notes WHERE id = ?',
        ['note-to-delete']
      );
    });

    it('should throw when database delete fails', async () => {
      useNoteStore.setState({
        notes: [
          {
            id: 'note-1',
            content: '笔记1',
            createdAt: 1000,
            updatedAt: 1000,
            wordCount: 1,
          },
        ],
      });

      mockRunAsync.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(
        useNoteStore.getState().deleteNote('note-1')
      ).rejects.toThrow('Delete failed');
    });

    it('should delete the last remaining note', async () => {
      useNoteStore.setState({
        notes: [
          {
            id: 'only-note',
            content: '唯一的笔记',
            createdAt: 1000,
            updatedAt: 1000,
            wordCount: 1,
          },
        ],
      });

      await useNoteStore.getState().deleteNote('only-note');

      const state = useNoteStore.getState();
      expect(state.notes).toHaveLength(0);
    });
  });

  describe('updateNote', () => {
    it('should update content, updatedAt and wordCount', async () => {
      useNoteStore.setState({
        notes: [
          {
            id: 'note-1',
            content: '旧内容',
            createdAt: 1000,
            updatedAt: 1000,
            wordCount: 2,
          },
        ],
      });

      await useNoteStore.getState().updateNote('note-1', '新的笔记内容');

      const state = useNoteStore.getState();
      expect(state.notes[0].content).toBe('新的笔记内容');
      expect(state.notes[0].wordCount).toBe(6);
      expect(state.notes[0].updatedAt).toBeGreaterThan(1000);
      // createdAt should not change
      expect(state.notes[0].createdAt).toBe(1000);
    });

    it('should call database UPDATE with correct parameters', async () => {
      useNoteStore.setState({
        notes: [
          {
            id: 'note-1',
            content: '旧内容',
            createdAt: 1000,
            updatedAt: 1000,
            wordCount: 2,
          },
        ],
      });

      await useNoteStore.getState().updateNote('note-1', '更新测试');

      expect(mockRunAsync).toHaveBeenCalledTimes(1);
      const [sql, params] = mockRunAsync.mock.calls[0];
      expect(sql).toContain('UPDATE notes SET');
      expect(params[0]).toBe('更新测试'); // content
      expect(typeof params[1]).toBe('number'); // updatedAt
      expect(params[2]).toBe(4); // wordCount (4 CJK chars)
      expect(params[3]).toBe('note-1'); // id
    });

    it('should not affect other notes', async () => {
      useNoteStore.setState({
        notes: [
          { id: 'note-1', content: 'A', createdAt: 1, updatedAt: 1, wordCount: 1 },
          { id: 'note-2', content: 'B', createdAt: 2, updatedAt: 2, wordCount: 1 },
        ],
      });

      await useNoteStore.getState().updateNote('note-1', '已修改');

      const state = useNoteStore.getState();
      expect(state.notes[0].content).toBe('已修改');
      expect(state.notes[1].content).toBe('B');
      expect(state.notes[1].updatedAt).toBe(2);
    });

    it('should throw when database update fails', async () => {
      useNoteStore.setState({
        notes: [
          { id: 'note-1', content: '内容', createdAt: 1, updatedAt: 1, wordCount: 2 },
        ],
      });

      mockRunAsync.mockRejectedValueOnce(new Error('Update failed'));

      await expect(
        useNoteStore.getState().updateNote('note-1', '新内容')
      ).rejects.toThrow('Update failed');
    });
  });

  describe('getNoteById', () => {
    it('should return note when found', () => {
      const testNote = {
        id: 'note-1',
        content: '测试笔记',
        createdAt: 1000,
        updatedAt: 1000,
        wordCount: 2,
      };

      useNoteStore.setState({ notes: [testNote] });

      const result = useNoteStore.getState().getNoteById('note-1');
      expect(result).toEqual(testNote);
    });

    it('should return undefined when not found', () => {
      useNoteStore.setState({ notes: [] });

      const result = useNoteStore.getState().getNoteById('non-existent');
      expect(result).toBeUndefined();
    });

    it('should find the correct note among multiple', () => {
      const notes = [
        { id: 'a', content: 'A', createdAt: 1, updatedAt: 1, wordCount: 1 },
        { id: 'b', content: 'B', createdAt: 2, updatedAt: 2, wordCount: 1 },
        { id: 'c', content: 'C', createdAt: 3, updatedAt: 3, wordCount: 1 },
      ];
      useNoteStore.setState({ notes });

      const result = useNoteStore.getState().getNoteById('b');
      expect(result?.content).toBe('B');
    });
  });

  describe('loadNotes', () => {
    it('should set isLoading to true while loading', async () => {
      const loadPromise = useNoteStore.getState().loadNotes();

      expect(useNoteStore.getState().isLoading).toBe(true);

      await loadPromise;

      expect(useNoteStore.getState().isLoading).toBe(false);
    });

    it('should load notes from database', async () => {
      const mockNotes = [
        { id: '1', content: '笔记1', createdAt: 2000, updatedAt: 2000, wordCount: 1 },
        { id: '2', content: '笔记2', createdAt: 1000, updatedAt: 1000, wordCount: 1 },
      ];
      mockGetAllAsync.mockResolvedValueOnce(mockNotes);

      await useNoteStore.getState().loadNotes();

      const state = useNoteStore.getState();
      expect(state.notes).toEqual(mockNotes);
      expect(state.isLoading).toBe(false);
    });

    it('should query with ORDER BY createdAt DESC', async () => {
      await useNoteStore.getState().loadNotes();

      expect(mockGetAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM notes ORDER BY createdAt DESC'
      );
    });

    it('should handle database error gracefully', async () => {
      mockGetAllAsync.mockRejectedValueOnce(new Error('Load failed'));

      await useNoteStore.getState().loadNotes();

      const state = useNoteStore.getState();
      expect(state.notes).toEqual([]);
      expect(state.isLoading).toBe(false);
    });

    it('should replace existing notes with loaded data', async () => {
      useNoteStore.setState({
        notes: [
          { id: 'old', content: '旧数据', createdAt: 1, updatedAt: 1, wordCount: 1 },
        ],
      });

      const freshNotes = [
        { id: 'new', content: '新数据', createdAt: 2, updatedAt: 2, wordCount: 1 },
      ];
      mockGetAllAsync.mockResolvedValueOnce(freshNotes);

      await useNoteStore.getState().loadNotes();

      const state = useNoteStore.getState();
      expect(state.notes).toEqual(freshNotes);
      expect(state.notes).toHaveLength(1);
    });
  });

  describe('CRUD integration flow', () => {
    it('should support add then delete flow', async () => {
      const note = await useNoteStore.getState().addNote('集成测试笔记');
      expect(useNoteStore.getState().notes).toHaveLength(1);

      await useNoteStore.getState().deleteNote(note.id);
      expect(useNoteStore.getState().notes).toHaveLength(0);
    });

    it('should support multiple adds then selective delete', async () => {
      // Add multiple notes (uuid is mocked to same value, so set manually)
      useNoteStore.setState({
        notes: [
          { id: 'note-1', content: '第一条', createdAt: 3000, updatedAt: 3000, wordCount: 1 },
          { id: 'note-2', content: '第二条', createdAt: 2000, updatedAt: 2000, wordCount: 1 },
          { id: 'note-3', content: '第三条', createdAt: 1000, updatedAt: 1000, wordCount: 1 },
        ],
      });

      await useNoteStore.getState().deleteNote('note-2');

      const state = useNoteStore.getState();
      expect(state.notes).toHaveLength(2);
      expect(state.notes.map((n) => n.id)).toEqual(['note-1', 'note-3']);
    });

    it('should get note by id after adding', async () => {
      await useNoteStore.getState().addNote('可查找的笔记');

      const found = useNoteStore.getState().getNoteById('test-uuid-1234');
      expect(found).toBeDefined();
      expect(found?.content).toBe('可查找的笔记');
    });
  });
});
