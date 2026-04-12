import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
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
import { colors } from '../../src/constants/theme';
import { noteScreen, markdownStyles, modeBar } from '../../src/styles/shared';

export default function NewNoteScreen() {
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
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
            style={noteScreen.headerBtn}
            activeOpacity={0.6}
          >
            <RNText style={[noteScreen.headerBtnPrimary, isSaving && noteScreen.dim]}>
              {isSaving ? '保存中' : '保存'}
            </RNText>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, hasContent, isSaving, handleSave]);

  return (
    <KeyboardAvoidingView
      style={noteScreen.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {hasContent && (
        <View style={modeBar.container}>
          <TouchableOpacity
            onPress={() => setShowPreview(false)}
            style={[modeBar.tab, !showPreview && modeBar.tabActive]}
            activeOpacity={0.7}
          >
            <RNText style={[modeBar.tabText, !showPreview && modeBar.tabTextActive]}>
              编辑
            </RNText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPreview(true)}
            style={[modeBar.tab, showPreview && modeBar.tabActive]}
            activeOpacity={0.7}
          >
            <RNText style={[modeBar.tabText, showPreview && modeBar.tabTextActive]}>
              预览
            </RNText>
          </TouchableOpacity>
        </View>
      )}

      {showPreview ? (
        <ScrollView
          style={noteScreen.reader}
          contentContainerStyle={noteScreen.readerContent}
          showsVerticalScrollIndicator={false}
        >
          <Markdown style={markdownStyles}>{content}</Markdown>
        </ScrollView>
      ) : (
        <>
          <View style={noteScreen.editorContainer}>
            <TextInput
              ref={inputRef}
              style={noteScreen.editor}
              placeholder="开始写作..."
              placeholderTextColor={colors.textTertiary}
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
