import { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useNoteStore } from '../../src/store/noteStore';

const AUTO_SAVE_DELAY = 800;

export default function NoteDetailScreen() {
  const { id, edit } = useLocalSearchParams<{ id: string; edit?: string }>();
  const navigation = useNavigation();
  const { getNoteById, updateNote } = useNoteStore();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(edit === '1');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef('');

  const note = getNoteById(id);

  useEffect(() => {
    if (note) {
      setContent(note.content);
      lastSavedRef.current = note.content;
    }
  }, [note?.id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        !isEditing ? (
          <IconButton
            icon="pencil"
            size={22}
            onPress={() => setIsEditing(true)}
          />
        ) : null,
    });
  }, [navigation, isEditing]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const doSave = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed === lastSavedRef.current) return;

    setSaveStatus('saving');
    try {
      await updateNote(id, trimmed);
      lastSavedRef.current = trimmed;
      setSaveStatus('saved');
    } catch {
      setSaveStatus('idle');
    }
  }, [id, updateNote]);

  const handleChangeText = useCallback((text: string) => {
    setContent(text);
    setSaveStatus('idle');

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSave(text), AUTO_SAVE_DELAY);
  }, [doSave]);

  if (!note) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyLarge">笔记不存在</Text>
      </View>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Surface style={styles.contentCard} elevation={1}>
        {isEditing ? (
          <TextInput
            style={styles.editInput}
            value={content}
            onChangeText={handleChangeText}
            multiline
            textAlignVertical="top"
            placeholder="输入笔记内容..."
            placeholderTextColor="#9e9e9e"
            autoFocus
          />
        ) : (
          <ScrollView style={styles.readContent}>
            <Text variant="bodyLarge" style={styles.readText}>
              {note.content}
            </Text>
          </ScrollView>
        )}
      </Surface>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.metaText}>
          {formatDate(note.createdAt)}
        </Text>
        <Text variant="bodySmall" style={styles.metaText}>
          {note.wordCount} 字
        </Text>
        <Text variant="bodySmall" style={styles.statusText}>
          {isEditing
            ? saveStatus === 'saving'
              ? '保存中...'
              : saveStatus === 'saved'
                ? '已保存'
                : ''
            : ''}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    flex: 1,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#212121',
  },
  readContent: {
    flex: 1,
  },
  readText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#212121',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  metaText: {
    color: '#9e9e9e',
  },
  statusText: {
    color: '#64B5F6',
    minWidth: 56,
    textAlign: 'right',
  },
});
