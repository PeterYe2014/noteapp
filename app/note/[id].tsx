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
import Markdown from 'react-native-markdown-display';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useNoteStore } from '../../src/store/noteStore';
import FormatToolbar from '../../src/components/FormatToolbar';

type Selection = { start: number; end: number };

const AUTO_SAVE_DELAY = 800;

export default function NoteDetailScreen() {
  const { id, edit } = useLocalSearchParams<{ id: string; edit?: string }>();
  const navigation = useNavigation();
  const { getNoteById, updateNote } = useNoteStore();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(edit === '1');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef('');
  const inputRef = useRef<TextInput>(null);

  const note = getNoteById(id);

  useEffect(() => {
    if (note) {
      setContent(note.content);
      lastSavedRef.current = note.content;
    }
  }, [note?.id]);

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

  const handleSwitchToPreview = useCallback(() => {
    setIsEditing(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    doSave(content);
  }, [content, doSave]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isEditing ? (
          <TouchableOpacity onPress={handleSwitchToPreview} style={styles.headerBtn} activeOpacity={0.6}>
            <RNText style={styles.headerBtnText}>完成</RNText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.headerBtn} activeOpacity={0.6}>
            <RNText style={styles.headerBtnText}>编辑</RNText>
          </TouchableOpacity>
        ),
    });
  }, [navigation, isEditing, handleSwitchToPreview]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChangeText = useCallback((text: string) => {
    setContent(text);
    setSaveStatus('idle');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSave(text), AUTO_SAVE_DELAY);
  }, [doSave]);

  const handleFormatInsert = useCallback((before: string, after: string = '') => {
    const { start, end } = selection;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    handleChangeText(newText);
    setTimeout(() => {
      const newCursorPos = start + before.length + selectedText.length + after.length;
      inputRef.current?.setNativeProps({ selection: { start: newCursorPos, end: newCursorPos } });
    }, 50);
  }, [content, selection, handleChangeText]);

  if (!note) {
    return (
      <View style={styles.centered}>
        <RNText style={styles.notFoundText}>笔记不存在</RNText>
      </View>
    );
  }

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {isEditing ? (
        <>
          <View style={styles.editorContainer}>
            <TextInput
              ref={inputRef}
              style={styles.editor}
              value={content}
              onChangeText={handleChangeText}
              multiline
              textAlignVertical="top"
              placeholder="输入 Markdown 内容..."
              placeholderTextColor="#C7C7CC"
              autoFocus
              onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
            />
          </View>
          <FormatToolbar onInsert={handleFormatInsert} />
        </>
      ) : (
        <ScrollView style={styles.reader} contentContainerStyle={styles.readerContent} showsVerticalScrollIndicator={false}>
          <Markdown style={markdownStyles}>{content}</Markdown>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <RNText style={styles.metaText}>{formatDate(note.createdAt)}</RNText>
        <View style={styles.footerRight}>
          <RNText style={styles.metaText}>{note.wordCount} 字</RNText>
          {isEditing && saveStatus !== 'idle' && (
            <RNText style={[styles.metaText, saveStatus === 'saved' && styles.metaSaved]}>
              {saveStatus === 'saving' ? '保存中' : '已保存'}
            </RNText>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const markdownStyles = {
  body: { fontSize: 16, lineHeight: 26, color: '#1C1C1E' },
  heading1: { fontSize: 26, fontWeight: '700' as const, color: '#1C1C1E', marginTop: 16, marginBottom: 8 },
  heading2: { fontSize: 22, fontWeight: '600' as const, color: '#1C1C1E', marginTop: 14, marginBottom: 6 },
  heading3: { fontSize: 18, fontWeight: '600' as const, color: '#1C1C1E', marginTop: 12, marginBottom: 4 },
  strong: { fontWeight: '700' as const },
  em: { fontStyle: 'italic' as const },
  code_inline: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    backgroundColor: '#F2F2F7',
    color: '#007AFF',
    borderRadius: 4,
  },
  fence: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    color: '#1C1C1E',
    marginVertical: 8,
  },
  blockquote: { borderLeftWidth: 3, borderLeftColor: '#007AFF', paddingLeft: 12, marginLeft: 0, opacity: 0.8 },
  list_item: { marginVertical: 2 },
  link: { color: '#007AFF' },
  hr: { backgroundColor: 'rgba(60, 60, 67, 0.12)', height: 1, marginVertical: 16 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  notFoundText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  headerBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerBtnText: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  editorContainer: {
    flex: 1,
  },
  editor: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    fontSize: 16,
    lineHeight: 26,
    color: '#1C1C1E',
  },
  reader: {
    flex: 1,
  },
  readerContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.12)',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  metaSaved: {
    color: '#34C759',
  },
});
