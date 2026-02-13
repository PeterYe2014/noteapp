import { create } from 'zustand';
import * as Crypto from 'expo-crypto';
import { Note } from '../types/note';
import { getDatabase } from '../db/database';
import { calculateWordCount } from '../utils/wordCount';

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  loadNotes: () => Promise<void>;
  addNote: (content: string) => Promise<Note>;
  updateNote: (id: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNoteById: (id: string) => Note | undefined;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  isLoading: false,

  loadNotes: async () => {
    set({ isLoading: true });
    try {
      const db = await getDatabase();
      const results = await db.getAllAsync<Note>(
        'SELECT * FROM notes ORDER BY createdAt DESC'
      );
      set({ notes: results, isLoading: false });
    } catch (error) {
      console.error('Failed to load notes:', error);
      set({ isLoading: false });
    }
  },

  addNote: async (content: string) => {
    const now = Date.now();
    const note: Note = {
      id: Crypto.randomUUID(),
      content,
      createdAt: now,
      updatedAt: now,
      wordCount: calculateWordCount(content),
    };

    try {
      const db = await getDatabase();
      await db.runAsync(
        'INSERT INTO notes (id, content, createdAt, updatedAt, wordCount) VALUES (?, ?, ?, ?, ?)',
        [note.id, note.content, note.createdAt, note.updatedAt, note.wordCount]
      );
      set((state) => ({ notes: [note, ...state.notes] }));
      return note;
    } catch (error) {
      console.error('Failed to add note:', error);
      throw error;
    }
  },

  updateNote: async (id: string, content: string) => {
    const now = Date.now();
    const wordCount = calculateWordCount(content);

    try {
      const db = await getDatabase();
      await db.runAsync(
        'UPDATE notes SET content = ?, updatedAt = ?, wordCount = ? WHERE id = ?',
        [content, now, wordCount, id]
      );
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id
            ? { ...note, content, updatedAt: now, wordCount }
            : note
        ),
      }));
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  },

  deleteNote: async (id: string) => {
    try {
      const db = await getDatabase();
      await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  },

  getNoteById: (id: string) => {
    return get().notes.find((note) => note.id === id);
  },
}));
