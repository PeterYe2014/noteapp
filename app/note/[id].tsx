import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
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
import { colors, spacing, radius } from '../../src/constants/theme';
import { noteScreen, markdownStyles } from '../../src/styles/shared';

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
      headerRight: () => (
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segment, isEditing && styles.segmentActive]}
            onPress={() => setIsEditing(true)}
            activeOpacity={0.8}
          >
            <RNText style={[styles.segmentText, isEditing && styles.segmentTextActive]}>编辑</RNText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, !isEditing && styles.segmentActive]}
            onPress={handleSwitchToPreview}
            activeOpacity={0.8}
          >
            <RNText style={[styles.segmentText, !isEditing && styles.segmentTextActive]}>预览</RNText>
          </TouchableOpacity>
        </View>
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
      <View style={noteScreen.centered}>
        <RNText style={noteScreen.notFoundText}>笔记不存在</RNText>
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
      style={noteScreen.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {isEditing ? (
        <>
          <View style={noteScreen.editorContainer}>
            <TextInput
              ref={inputRef}
              style={noteScreen.editor}
              value={content}
              onChangeText={handleChangeText}
              multiline
              textAlignVertical="top"
              placeholder="输入 Markdown 内容..."
              placeholderTextColor={colors.textTertiary}
              autoFocus
              onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
            />
          </View>
          <FormatToolbar onInsert={handleFormatInsert} />
        </>
      ) : (
        <ScrollView style={noteScreen.reader} contentContainerStyle={noteScreen.readerContent} showsVerticalScrollIndicator={false}>
          <Markdown style={markdownStyles}>{content}</Markdown>
        </ScrollView>
      )}

      <View style={noteScreen.footer}>
        <RNText style={noteScreen.metaText}>{formatDate(note.createdAt)}</RNText>
        <View style={noteScreen.footerRight}>
          <RNText style={noteScreen.metaText}>{note.wordCount} 字</RNText>
          {isEditing && saveStatus !== 'idle' && (
            <RNText style={[noteScreen.metaText, saveStatus === 'saved' && noteScreen.metaSaved]}>
              {saveStatus === 'saving' ? '保存中' : '已保存'}
            </RNText>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  segmentedControl: {
    flexDirection: 'row' as const,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: 2,
  },
  segment: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  segmentActive: {
    backgroundColor: colors.surface,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.text,
  },
};
