import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../types/note';
import { getDatabase } from '../db/database';

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  loadNotes: () => Promise<void>;
  addNote: (content: string) => Promise<Note>;
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
      id: uuidv4(),
      content,
      createdAt: now,
      updatedAt: now,
      wordCount: content.trim().split(/\s+/).filter(Boolean).length,
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
