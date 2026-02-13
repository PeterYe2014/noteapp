import { useNoteStore } from '../store/noteStore';

// Reset store before each test
beforeEach(() => {
  useNoteStore.setState({ notes: [], isLoading: false });
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
      // Manually set initial state with existing note
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
  });

  describe('deleteNote', () => {
    it('should remove note by id', async () => {
      // Set up initial notes
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
  });

  describe('loadNotes', () => {
    it('should set isLoading to true while loading', async () => {
      const loadPromise = useNoteStore.getState().loadNotes();

      // isLoading should be true immediately after calling
      expect(useNoteStore.getState().isLoading).toBe(true);

      await loadPromise;

      // isLoading should be false after completion
      expect(useNoteStore.getState().isLoading).toBe(false);
    });
  });
});
