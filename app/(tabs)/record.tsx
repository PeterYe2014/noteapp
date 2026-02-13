import { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, IconButton, Surface, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useNoteStore } from '../../src/store/noteStore';

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { addNote } = useNoteStore();

  const handleRecordPress = () => {
    setIsRecording(!isRecording);
    // TODO: 第三周实现语音识别功能
  };

  const handleSave = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      Alert.alert('提示', '请输入笔记内容');
      return;
    }

    setIsSaving(true);
    try {
      await addNote(trimmed);
      setContent('');
      Keyboard.dismiss();
      router.navigate('/');
    } catch {
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Surface style={styles.transcriptArea} elevation={1}>
        {isRecording ? (
          <Text variant="bodyLarge" style={styles.transcriptText}>
            正在录音...
          </Text>
        ) : (
          <TextInput
            style={styles.textInput}
            placeholder="输入笔记内容..."
            placeholderTextColor="#9e9e9e"
            multiline
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        )}
      </Surface>

      <View style={styles.buttonContainer}>
        {content.trim().length > 0 && !isRecording && (
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
            style={styles.saveButton}
            icon="content-save"
          >
            保存笔记
          </Button>
        )}
        <IconButton
          icon={isRecording ? 'stop' : 'microphone'}
          mode="contained"
          size={48}
          iconColor="#fff"
          containerColor={isRecording ? '#f44336' : '#6200EE'}
          onPress={handleRecordPress}
          style={styles.recordButton}
        />
        <Text variant="bodyMedium" style={styles.hint}>
          {isRecording ? '点击停止' : '输入文字或点击录音'}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  transcriptArea: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  transcriptText: {
    color: '#757575',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#212121',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  saveButton: {
    marginBottom: 16,
    width: '100%',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  hint: {
    marginTop: 12,
    color: '#757575',
  },
});
