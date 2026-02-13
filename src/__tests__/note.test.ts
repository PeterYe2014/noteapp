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
  const { calculateWordCount } = require('../utils/wordCount');

  it('should count each Chinese character', () => {
    expect(calculateWordCount('你好世界')).toBe(4);
  });

  it('should count Chinese characters separated by spaces', () => {
    expect(calculateWordCount('你好 世界')).toBe(4);
  });

  it('should count English words by spaces', () => {
    expect(calculateWordCount('hello world')).toBe(2);
  });

  it('should handle empty string', () => {
    expect(calculateWordCount('')).toBe(0);
  });

  it('should handle whitespace only', () => {
    expect(calculateWordCount('   ')).toBe(0);
  });

  it('should handle mixed Chinese and English', () => {
    // 4 CJK chars (你好世界) + 2 English words (Hello World) = 6
    expect(calculateWordCount('Hello 你好 World 世界')).toBe(6);
  });

  it('should count a full Chinese sentence', () => {
    expect(calculateWordCount('这是一条测试笔记')).toBe(8);
  });

  it('should handle English only with multiple spaces', () => {
    expect(calculateWordCount('hello   world')).toBe(2);
  });

  it('should handle single character', () => {
    expect(calculateWordCount('A')).toBe(1);
    expect(calculateWordCount('中')).toBe(1);
  });
});
