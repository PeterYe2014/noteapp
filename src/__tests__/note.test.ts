import { Note } from '../types/note';

describe('Note type', () => {
  it('should create a valid Note object', () => {
    const note: Note = {
      id: 'test-id-123',
      content: '这是测试内容',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      wordCount: 4,
    };

    expect(note.id).toBe('test-id-123');
    expect(note.content).toBe('这是测试内容');
    expect(typeof note.createdAt).toBe('number');
    expect(typeof note.updatedAt).toBe('number');
    expect(note.wordCount).toBe(4);
  });

  it('should have updatedAt >= createdAt', () => {
    const createdAt = Date.now();
    const updatedAt = createdAt + 1000;

    const note: Note = {
      id: 'test-id',
      content: 'test',
      createdAt,
      updatedAt,
      wordCount: 1,
    };

    expect(note.updatedAt).toBeGreaterThanOrEqual(note.createdAt);
  });
});

describe('Word count calculation', () => {
  const calculateWordCount = (content: string): number => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  };

  it('should count Chinese words separated by spaces', () => {
    expect(calculateWordCount('你好 世界')).toBe(2);
  });

  it('should count English words', () => {
    expect(calculateWordCount('hello world')).toBe(2);
  });

  it('should handle empty string', () => {
    expect(calculateWordCount('')).toBe(0);
  });

  it('should handle whitespace only', () => {
    expect(calculateWordCount('   ')).toBe(0);
  });

  it('should handle mixed content', () => {
    expect(calculateWordCount('Hello 你好 World 世界')).toBe(4);
  });
});
