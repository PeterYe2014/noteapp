import { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Surface, Portal, Dialog } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNoteStore } from '../../src/store/noteStore';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getNoteById, deleteNote } = useNoteStore();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const note = getNoteById(id);

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

  const handleDelete = async () => {
    try {
      await deleteNote(id);
      setDeleteDialogVisible(false);
      router.back();
    } catch (error) {
      Alert.alert('错误', '删除失败，请重试');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.contentCard} elevation={1}>
          <Text variant="bodyLarge" style={styles.content}>
            {note.content}
          </Text>
        </Surface>

        <View style={styles.meta}>
          <Text variant="bodySmall" style={styles.metaText}>
            创建时间：{formatDate(note.createdAt)}
          </Text>
          <Text variant="bodySmall" style={styles.metaText}>
            字数：{note.wordCount}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          mode="contained"
          buttonColor="#f44336"
          onPress={() => setDeleteDialogVisible(true)}
          icon="delete"
        >
          删除笔记
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>确认删除</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">确定要删除这条笔记吗？此操作无法撤销。</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>取消</Button>
            <Button onPress={handleDelete} textColor="#f44336">
              删除
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  contentCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  content: {
    lineHeight: 24,
  },
  meta: {
    marginTop: 16,
    paddingHorizontal: 4,
  },
  metaText: {
    color: '#757575',
    marginBottom: 4,
  },
  actions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
});
