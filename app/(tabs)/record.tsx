import { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
  Text as RNText,
} from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNoteStore } from '../../src/store/noteStore';

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { addNote } = useNoteStore();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isRecording) {
      pulseOpacity.setValue(0.5);
      pulseAnimation.current = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.6,
              duration: 900,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 0,
              duration: 900,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 0.5,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );
      pulseAnimation.current.start();
    } else {
      pulseAnimation.current?.stop();
      Animated.parallel([
        Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(pulseOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
    return () => pulseAnimation.current?.stop();
  }, [isRecording]);

  const handleRecordPress = () => {
    setIsRecording(!isRecording);
    // TODO: M3 实现语音识别功能
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
      <View style={styles.inputArea}>
        {isRecording ? (
          <View style={styles.recordingPlaceholder}>
            <Text style={styles.recordingText}>正在聆听...</Text>
          </View>
        ) : (
          <TextInput
            style={styles.textInput}
            placeholder="在这里写下你的想法..."
            placeholderTextColor="#C7C7CC"
            multiline
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        )}
      </View>

      <View style={styles.bottomArea}>
        {content.trim().length > 0 && !isRecording && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <RNText style={styles.saveButtonText}>
              {isSaving ? '保存中...' : '保存笔记'}
            </RNText>
          </TouchableOpacity>
        )}

        <View style={styles.micWrapper}>
          <Animated.View
            style={[
              styles.pulseDot,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseOpacity,
              },
            ]}
          />
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonActive]}
            onPress={handleRecordPress}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isRecording ? 'stop' : 'mic'}
              size={32}
              color={isRecording ? '#FF3B30' : '#1C1C1E'}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          {isRecording ? '点击停止录音' : content.trim().length > 0 ? '' : '输入文字或点击麦克风录音'}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  inputArea: {
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
  recordingPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
    color: '#1C1C1E',
    fontWeight: '400',
  },
  bottomArea: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  micWrapper: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 59, 48, 0.3)',
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  micButtonActive: {
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
  },
  hint: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
    minHeight: 18,
  },
});
