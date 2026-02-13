import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordPress = () => {
    setIsRecording(!isRecording);
    // TODO: 第三周实现语音识别功能
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.transcriptArea} elevation={1}>
        <Text variant="bodyLarge" style={styles.transcriptText}>
          {isRecording ? '正在录音...' : '点击麦克风开始录音'}
        </Text>
      </Surface>

      <View style={styles.buttonContainer}>
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
          {isRecording ? '点击停止' : '点击录音'}
        </Text>
      </View>
    </View>
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
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 32,
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
