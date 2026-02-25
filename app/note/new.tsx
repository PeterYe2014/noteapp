import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text as RNText,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useRouter, useNavigation } from 'expo-router';
import { useNoteStore } from '../../src/store/noteStore';
import FormatToolbar from '../../src/components/FormatToolbar';

type Selection = { start: number; end: number };

export default function NewNoteScreen() {
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();
  const navigation = useNavigation();
  const { addNote } = useNoteStore();

  const hasContent = content.trim().length > 0;

  const handleFormatInsert = useCallback((before: string, after: string = '') => {
    const { start, end } = selection;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    setContent(newText);
    // 延迟设置光标位置
    setTimeout(() => {
      const newCursorPos = start + before.length + selectedText.length + after.length;
      inputRef.current?.setNativeProps({ selection: { start: newCursorPos, end: newCursorPos } });
    }, 50);
  }, [content, selection]);

  const handleSave = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setIsSaving(true);
    try {
      await addNote(trimmed);
      setContent('');
      setShowPreview(false);
      Keyboard.dismiss();
      router.back();
    } catch {
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  }, [content, addNote, router]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        hasContent ? (
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            style={styles.headerBtn}
            activeOpacity={0.6}
          >
            <RNText style={[styles.headerBtnPrimary, isSaving && styles.dim]}>
              {isSaving ? '保存中' : '保存'}
            </RNText>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, hasContent, isSaving, handleSave]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {hasContent && (
        <View style={styles.modeBar}>
          <TouchableOpacity
            onPress={() => setShowPreview(false)}
            style={[styles.modeTab, !showPreview && styles.modeTabActive]}
            activeOpacity={0.7}
          >
            <RNText style={[styles.modeTabText, !showPreview && styles.modeTabTextActive]}>
              编辑
            </RNText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPreview(true)}
            style={[styles.modeTab, showPreview && styles.modeTabActive]}
            activeOpacity={0.7}
          >
            <RNText style={[styles.modeTabText, showPreview && styles.modeTabTextActive]}>
              预览
            </RNText>
          </TouchableOpacity>
        </View>
      )}

      {showPreview ? (
        <ScrollView
          style={styles.reader}
          contentContainerStyle={styles.readerContent}
          showsVerticalScrollIndicator={false}
        >
          <Markdown style={markdownStyles}>{content}</Markdown>
        </ScrollView>
      ) : (
        <>
          <View style={styles.editorContainer}>
            <TextInput
              ref={inputRef}
              style={styles.editor}
              placeholder="开始写作..."
              placeholderTextColor="#C7C7CC"
              multiline
              value={content}
              onChangeText={setContent}
              onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
              textAlignVertical="top"
              autoFocus
            />
          </View>
          <FormatToolbar onInsert={handleFormatInsert} />
        </>
      )}
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
  modeBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.12)',
  },
  modeTab: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  modeTabActive: {
    backgroundColor: '#F2F2F7',
  },
  modeTabText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  modeTabTextActive: {
    color: '#1C1C1E',
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
    paddingBottom: 16,
  },
  headerBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerBtnPrimary: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  dim: {
    opacity: 0.5,
  },
});
