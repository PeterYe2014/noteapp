import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text as RNText,
} from 'react-native';
import { Text } from 'react-native-paper';
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
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.headerButton}
            activeOpacity={0.6}
          >
            <RNText style={styles.headerButtonText}>编辑</RNText>
          </TouchableOpacity>
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
        <Text style={styles.notFoundText}>笔记不存在</Text>
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
      <View style={styles.contentCard}>
        {isEditing ? (
          <TextInput
            style={styles.editInput}
            value={content}
            onChangeText={handleChangeText}
            multiline
            textAlignVertical="top"
            placeholder="输入笔记内容..."
            placeholderTextColor="#C7C7CC"
            autoFocus
          />
        ) : (
          <ScrollView style={styles.readContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.readText}>{note.content}</Text>
          </ScrollView>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.metaText}>{formatDate(note.createdAt)}</Text>
        <View style={styles.footerRight}>
          <Text style={styles.metaText}>{note.wordCount} 字</Text>
          {isEditing && saveStatus !== 'idle' && (
            <Text style={[styles.statusText, saveStatus === 'saved' && styles.statusSaved]}>
              {saveStatus === 'saving' ? '保存中' : '已保存'}
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  notFoundText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerButtonText: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '400',
  },
  contentCard: {
    flex: 1,
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
    color: '#1C1C1E',
    fontWeight: '400',
  },
  readContent: {
    flex: 1,
  },
  readText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#1C1C1E',
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '400',
  },
  statusText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  statusSaved: {
    color: '#34C759',
  },
});
